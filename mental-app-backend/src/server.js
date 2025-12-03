import express from 'express';
import dotenv from 'dotenv';
import { pool, ping } from './db.js';
import bcrypt from 'bcryptjs';
import cors from "cors";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { Client } from '@googlemaps/google-maps-services-js';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    // Get token from the Authorization header (e.g., "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (invalid token)
        }
        // Attach the decoded payload to the request object
        req.user = payload.user; 
        next(); // Proceed to the next middleware or route handler
    });
};

// Health check
app.get('/health', async (_req, res) => {
  try {
    res.json({ status: (await ping()) ? 'ok' : 'error' });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// ✅ NEW: Forgot Password endpoint
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user by email
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // For security, we send a success message even if the user doesn't exist.
    // This prevents attackers from guessing which emails are registered.
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // 2. Generate a secure, random token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = Date.now() + 3600000; // Token expires in 1 hour (3600000 ms)

    // 3. Store the token and expiration date in the database
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, tokenExpires, user.id]
    );

    // 4. Send the email with the reset link 📧
    // IMPORTANT: Configure this with your actual email service provider
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another service
      auth: {
        user: process.env.EMAIL_USER, // Your email address from .env file
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link will expire in one hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// ✅ NEW: Reset Password endpoint
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1. Find the user with a valid, non-expired token
    // We check if the token exists AND if the expiration time is in the future.
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?',
      [token, Date.now()] // Date.now() gives the current time in milliseconds
    );

    const user = rows[0];

    // 2. If no user is found, the token is invalid or expired
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // 3. Hash the new password securely
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Update the user's password and clear the reset token fields
    // It's crucial to nullify the token so it cannot be used again.
    await pool.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [password_hash, user.id]
    );

    // 5. Send a success response
    res.json({ message: 'Your password has been updated successfully!' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// ✅ MODIFIED: Create user [endpoint] to use "username"
app.post('/users', async (req, res) => {
  try {
    const { email, username, password } = req.body; // Changed 'name' to 'username'
    if (!email || !username || !password) return res.status(400).json({ error: 'email, username, password required' });
    
    const password_hash = await bcrypt.hash(password, 10);
    
    const [r] = await pool.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)', // Changed 'name' to 'username'
      [email, username, password_hash]
    );
    
    res.status(201).json({ id: r.insertId, email, username });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email or Username already exists' });
    res.status(500).json({ error: String(e) });
  }
});

// ✅ NEW: Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // More generic error
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 1. Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        };

        // 2. Sign the Token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token will be valid for 7 days
        );
        
        // 3. Send back the token and user data
        const { password_hash, ...userData } = user;
        res.json({ token, user: userData });

    } catch (e) {
        res.status(500).json({ message: 'Server error', error: String(e) });
    }
});

// ========== SLEEP DATA ENDPOINTS (Protected) ==========

// ✅ NEW: Get all sleep entries for the logged-in user
app.get('/sleep-entries', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authenticated token
        
        const [rows] = await pool.execute(
            'SELECT * FROM sleep_entries WHERE user_id = ? ORDER BY entry_date ASC', 
            [userId]
        );
        
        res.json(rows);
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: String(e) });
    }
});

// ✅ NEW: Add or Update a sleep entry for a specific day
app.post('/sleep-entries', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from token
        const { entry_date, sleep_time, wake_time, duration } = req.body;

        if (!entry_date || !sleep_time || !wake_time || duration === undefined) {
            return res.status(400).json({ message: 'Missing required sleep data fields.' });
        }

        // Using INSERT ... ON DUPLICATE KEY UPDATE is highly efficient.
        // It relies on the UNIQUE key we created on (user_id, entry_date).
        // If a row for that user and date exists, it UPDATES it. Otherwise, it INSERTS it.
        const sql = `
            INSERT INTO sleep_entries (user_id, entry_date, sleep_time, wake_time, duration)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                sleep_time = VALUES(sleep_time),
                wake_time = VALUES(wake_time),
                duration = VALUES(duration);
        `;

        await pool.execute(sql, [userId, entry_date, sleep_time, wake_time, duration]);

        res.status(201).json({ message: 'Sleep entry saved successfully.' });

    } catch (e) {
        res.status(500).json({ message: 'Server error', error: String(e) });
    }
});

// ========== DOCTOR SUGGESTION ENDPOINT (Protected) ==========

app.get('/doctors', authenticateToken, async (req, res) => {
    // 1. Get location from the frontend query parameters
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    // Initialize the Google Maps Client
    const client = new Client({});

    try {
        // 2. Make the API request to Google Places
        const response = await client.placesNearby({
            params: {
                location: { lat, lng }, // User's location
                radius: 5000,           // Search within a 5km radius
                keyword: 'psychiatrist',// Search for psychiatrists
                key: process.env.GOOGLE_PLACES_API_KEY,
            },
            timeout: 1000, // Optional timeout
        });

        // 3. Process the results from Google
        // The API returns a lot of data; we'll extract what we need.
        const doctors = response.data.results.map(place => {
            return {
                id: place.place_id,
                name: place.name,
                address: place.vicinity, // 'vicinity' is a simplified address
                rating: place.rating || 0, // The place's rating, from 1.0 to 5.0
                total_ratings: place.user_ratings_total || 0,
                location: place.geometry.location,
                // Note: Fee and Gender are NOT provided by the Google Places API.
                // You would need a more specialized healthcare API for that data.
            };
        });

        // 4. Send the processed list back to the frontend
        res.json(doctors);

    } catch (error) {
        console.error('Google Places API Error:', error);
        res.status(500).json({ message: 'Failed to fetch doctors.', error: error.message });
    }
});

// List users 
app.get('/users', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, username, created_at FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// 2. ✅ UPDATED: Chatbot with Sleep + Emotion Context
app.post('/virtual-doctor/chat', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    try {
        // A. Fetch Sleep Data
        const [sleepRows] = await pool.execute(
            `SELECT entry_date, duration FROM sleep_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT 5`,
            [userId]
        );
        const sleepContext = sleepRows.length ? sleepRows.map(r => `[Sleep] Date: ${r.entry_date.toISOString().split('T')[0]}, Duration: ${r.duration} hrs`).join('\n') : "No sleep data.";

        // B. Fetch Recent Emotions (Last 24 hours)
        const [moodRows] = await pool.execute(
            `SELECT emotion, created_at FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
            [userId]
        );
        const moodContext = moodRows.length ? moodRows.map(r => `[Mood History] Time: ${r.created_at}, Emotion: ${r.emotion}`).join('\n') : "No recent mood scans.";

        // C. Construct System Prompt
        const systemPrompt = `
            You are Dr. Nova, a virtual psychiatrist.
            
            == PATIENT CONTEXT ==
            ${sleepContext}
            ${moodContext}
            =====================

            INSTRUCTIONS:
            1. Look at the [Mood History]. If the user was recently 'sad' or 'fearful', acknowledge it gently.
            2. Look at [Sleep]. If sleep is low, connect it to their mood.
            3. User Message: "${message}"
            4. Keep response under 3 sentences. Be empathetic.
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ message: 'Dr. Nova is offline.' });
    }
});

// 1. ✅ NEW: Post Mood Log Endpoint
app.post('/mood-logs', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { emotion, confidence, note } = req.body;

        if (!emotion) return res.status(400).json({ message: 'Emotion is required' });

        await pool.execute(
            'INSERT INTO mood_logs (user_id, emotion, confidence, note) VALUES (?, ?, ?, ?)',
            [userId, emotion, confidence || 0, note || 'Detected via Face AI']
        );

        res.status(201).json({ message: 'Mood logged successfully.' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// ✅ NEW: Get all public feedbacks (No auth required to READ)
app.get('/feedbacks', async (_req, res) => {
    try {
        // Join with users table to get the username of the reviewer
        const query = `
            SELECT f.id, f.rating, f.message, f.created_at, u.username 
            FROM feedbacks f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC
        `;
        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// ✅ NEW: Post a new feedback (Auth required to WRITE)
app.post('/feedbacks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, message } = req.body;

        if (!rating || !message) {
            return res.status(400).json({ message: 'Rating and message are required' });
        }

        await pool.execute(
            'INSERT INTO feedbacks (user_id, rating, message) VALUES (?, ?, ?)',
            [userId, rating, message]
        );

        res.status(201).json({ message: 'Thank you for your feedback!' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});

