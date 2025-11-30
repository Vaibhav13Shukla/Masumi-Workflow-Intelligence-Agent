import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// NOTE: In a real production app, this would be behind a proxy.
// For the hackathon demo (and this secure env), we assume the key is available.
// Coding Guideline: API key must be obtained exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAgentCode = async (patternName: string, description: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found, returning mock code.");
    return mockCodeGenerator(patternName);
  }

  try {
    const prompt = `
      You are an expert Python automation engineer.
      Generate a production-ready, error-handled Python script using Selenium or Beautiful Soup 
      for the following automation task:
      
      Task Name: ${patternName}
      Description: ${description}
      
      Requirements:
      - Include comprehensive error handling
      - Use environment variables for credentials
      - Include comments explaining the logic
      - Return ONLY the code, no markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let code = response.text || "";
    // Clean up markdown code blocks if Gemini adds them
    code = code.replace(/```python/g, '').replace(/```/g, '');
    return code;

  } catch (error) {
    console.error("Gemini generation failed:", error);
    return mockCodeGenerator(patternName);
  }
};

const mockCodeGenerator = (name: string) => {
  return `
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

class ${name.replace(/\s+/g, '')}Agent:
    def __init__(self):
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(options=self.options)

    def execute(self):
        print("Starting ${name}...")
        try:
            # Step 1: Initialize
            self.driver.get("https://dashboard.example.com")
            time.sleep(2)
            
            # Step 2: Perform Actions
            print("Navigating to target...")
            # ... automation logic ...
            
            print("Task completed successfully")
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
        finally:
            self.driver.quit()

if __name__ == "__main__":
    agent = ${name.replace(/\s+/g, '')}Agent()
    agent.execute()
`;
};