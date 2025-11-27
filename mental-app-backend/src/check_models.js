import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log("Checking available models...");
    // This is a direct fetch because the SDK helper for listing models varies by version
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS:");
      data.models.forEach((m) => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
      console.log("\nCopy one of the names above into your server.js file!");
    } else {
      console.log("❌ No models found. Error details:", data);
    }
  } catch (error) {
    console.error("❌ Error fetching models:", error);
  }
}

listModels();