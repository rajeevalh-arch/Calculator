import { GoogleGenAI } from "@google/genai";
import { UserInputs, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export async function analyzeOperationalLeakage(inputs: UserInputs): Promise<AnalysisResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set the API_KEY environment variable in Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const userPrompt = `
    INPUT PAYLOAD:
    {
      "industry": "${inputs.industry}",
      "mov": ${inputs.mov},
      "shifts": ${inputs.shifts},
      "scrap_percent": ${inputs.scrap_percent},
      "rework_percent": ${inputs.rework_percent},
      "downtime_hr_wk": ${inputs.downtime_hr_wk},
      "otd_percent": ${inputs.otd_percent},
      "expediting_freq": "${inputs.expediting_freq}",
      "decision_latency": "${inputs.decision_latency}",
      "data_discipline": "${inputs.data_discipline}"
    }
    
    Please analyze this plant's performance and return the leakage report in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Analysis engine returned no data.");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}