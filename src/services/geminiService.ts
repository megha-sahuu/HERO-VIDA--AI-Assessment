import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssessmentResult, DamageType, Severity } from "../types";
import { ANALYSIS_PROMPT } from "./prompts";

const processImage = async (base64Image: string): Promise<AssessmentResult> => {
  // Vite uses import.meta.env, not process.env
  const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key not found. Please set the VITE_API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove data:image/png;base64, prefix if present
  const base64Data = base64Image.split(',')[1] || base64Image;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      vehicleType: { type: Type.STRING, description: "Specific Vehicle Category (e.g., 'Scooter', '3-Wheeler', 'Car')" },
      fraudRisk: {
        type: Type.STRING,
        enum: ['Low', 'Medium', 'High'],
        description: "Assessment of potential fraud based on visible anomalies"
      },
      damages: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Unique identifier for the damage" },
            type: {
              type: Type.STRING,
              enum: [
                'Dent', 'Scratch', 'Crack', 'Broken Glass', 'Paint Damage', 'Missing Part', 'Other'
              ]
            },
            category: {
              type: Type.STRING,
              enum: ['Cosmetic', 'Functional'],
              description: "Whether the damage is purely visual (Cosmetic) or affects operation/structure (Functional)"
            },
            severity: {
              type: Type.STRING,
              enum: ['Low', 'Medium', 'High', 'Critical']
            },
            description: { type: Type.STRING, description: "Short description of the damage" },
            requiredPart: { type: Type.STRING, description: "The specific name of the vehicle part that is damaged (e.g. 'Front Bumper', 'Left Headlight', 'Windshield', 'Front Panel')." },
            estimatedCost: { type: Type.NUMBER, description: "Estimated repair cost in INR (Indian Rupee)" },
            repairCosts: {
              type: Type.OBJECT,
              properties: {
                labor: { type: Type.NUMBER, description: "Labor cost in INR" },
                parts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['Genuine', 'Aftermarket', 'Used'] },
                      price: { type: Type.NUMBER, description: "Price in INR" },
                      availability: { type: Type.STRING, description: "Availability status" }
                    },
                    required: ["type", "price"]
                  }
                },
                bestOptionTotal: { type: Type.NUMBER, description: "Total best estimated cost" }
              },
              required: ["labor", "parts", "bestOptionTotal"]
            },
            box_2d: {
              type: Type.ARRAY,
              description: "Bounding box coordinates [ymin, xmin, ymax, xmax] on a 0-1000 scale.",
              items: { type: Type.NUMBER }
            }
          },
          required: ["id", "type", "severity", "description", "estimatedCost", "repairCosts", "box_2d"]
        }
      },
      totalEstimatedCost: { type: Type.NUMBER, description: "Sum of all estimated costs" },
      summary: { type: Type.STRING, description: "Professional executive summary including vehicle identification and damage overview." },
      confidenceScore: { type: Type.NUMBER, description: "Confidence score of the assessment between 0 and 1" }
    },
    required: ["vehicleType", "fraudRisk", "damages", "totalEstimatedCost", "summary", "confidenceScore"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: ANALYSIS_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Very low temperature for precise, grounded facts
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI model");
    }

    const parsedData = JSON.parse(resultText);

    return {
      ...parsedData,
      id: `RPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const geminiService = {
  processImage
};