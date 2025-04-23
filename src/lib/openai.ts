import OpenAI from "openai";

// Initialize the OpenAI client with an environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only use this for testing
});

export default openai; 