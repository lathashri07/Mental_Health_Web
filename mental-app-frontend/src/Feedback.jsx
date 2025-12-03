import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, MessageCircle, Send, ArrowLeft, 
  Quote, User, Loader2, ThumbsUp 
} from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch Reviews on Load
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:3000/feedbacks");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, message }),
      });

      if (response.ok) {
        setSuccess(true);
        setMessage("");
        setRating(0);
        fetchReviews(); // Refresh list
      } else {
        setError("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-700">
              <MessageCircle size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Community Feedback</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Submission Form */}
        <section className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-28">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Share your thoughts</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Your feedback helps us improve MindHaven for everyone. How was your experience?
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rate Us</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-300"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating > 0 ? "Needs Work" : ""}
                </p>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
                <textarea
                  rows="5"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition resize-none text-slate-700"
                  placeholder="Tell us what you liked or what we can improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Feedback Messages */}
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              {success && (
                <div className="text-teal-700 text-sm bg-teal-50 p-3 rounded-lg flex items-center gap-2">
                  <ThumbsUp size={16} /> Thanks for your review!
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Submit Review
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Display Wall */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-700">Recent Reviews</h2>
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {reviews.length} Stories
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p>Loading community voices...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <MessageCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No reviews yet. Be the first to share your story!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center text-teal-700 font-bold border border-white shadow-sm">
                        {review.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{review.username}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* Stars Display */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="relative flex-grow">
                    <Quote size={20} className="absolute -top-1 -left-1 text-slate-200 transform -scale-x-100 opacity-50" />
                    <p className="text-slate-600 text-sm leading-relaxed pl-6 italic">
                      "{review.message}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Feedback;