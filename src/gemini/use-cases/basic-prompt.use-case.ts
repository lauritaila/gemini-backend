import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptUseCase = async (ai: GoogleGenAI, basicPrompt: BasicPromptDto, options?: Options) => {
    const model = options?.model || "gemini-2.5-flash";
    const systemInstruction = options?.systemInstruction || "responde en ingles de manera concisa y clara. en formato markdown";

    const response = await ai.models.generateContent({
        model: model,
        contents: basicPrompt.prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
}