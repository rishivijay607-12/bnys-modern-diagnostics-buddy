import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.error("API_KEY environment variable is not set. The application will not function correctly.");
}

export const isApiKeySet = !!apiKey;

export const generateStudyGuide = async (topic: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Check API_KEY.");
  }

  const systemInstruction = `You are an expert medical educator specializing in integrating modern diagnostics with naturopathic principles for Bachelor of Naturopathy and Yogic Sciences (BNYS) students. Your goal is to provide comprehensive, well-structured, and easy-to-understand study guides.`;

  const userPrompt = `
    Generate a study guide on the topic: "${topic}".

    The guide must be formatted using markdown and include these sections:
    
    ### 1. Introduction
    *   Overview of the diagnostic method and its clinical relevance.

    ### 2. Core Principles
    *   The scientific/physiological principles behind the test.
    *   What is measured and why it's important.

    ### 3. Procedure
    *   A concise, step-by-step process from sample collection to analysis.

    ### 4. Interpretation of Results
    *   How to interpret findings, including normal ranges and the significance of abnormal values.

    ### 5. Visual Aid (Diagram/Flowchart)
    *   Create a simple diagram or flowchart using Mermaid syntax inside a \`\`\`mermaid code block. This should illustrate a key process (e.g., procedural steps, result interpretation).

    ### 6. Naturopathic & Yogic Perspective
    *   **Crucial Section:** Connect the diagnostic tool to naturopathic philosophy.
    *   How results inform naturopathic treatments (diet, herbs, etc.).
    *   Suggest relevant yogic practices (asanas, pranayama) for conditions indicated by results.

    ### 7. Limitations & Contraindications
    *   Limitations of the test, potential for false results, and interfering factors.
    *   Contraindications for the test.

    ### 8. Key Takeaways & Important Notes
    *   Summarize the most critical points.
    *   Use markdown blockquotes (>) for crucial warnings or important notes.

    Ensure the language is professional yet accessible. Use lists, bold text, and clear headings. Use unordered lists with asterisks (*).
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to fetch response from Gemini API.");
  }
};

export const defineWord = async (term: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Check API_KEY.");
  }

  const systemInstruction = `You are a helpful medical dictionary. Your task is to provide clear, concise definitions.`;
  const userPrompt = `Define the medical or scientific term "${term}" in a way that is easy for a student of naturopathy and yogic sciences to understand. Keep the definition to a few sentences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error(`Error defining term "${term}":`, error);
    throw new Error("Failed to fetch definition from Gemini API.");
  }
};
