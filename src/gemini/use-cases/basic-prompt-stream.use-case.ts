import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPrompt: BasicPromptDto, options?: Options) => {
    const files = basicPrompt.files || [];

    const uploadedFiles = await geminiUploadFiles(ai, files);
 
    const model = options?.model || "gemini-2.5-flash";
    const systemInstruction = options?.systemInstruction || "responde en ingles de manera concisa y clara. en formato markdown";

    const response = await ai.models.generateContentStream({
        model: model,
        contents: [
            createUserContent([
                basicPrompt.prompt,
                ...uploadedFiles.map((file) => createPartFromUri(file.uri ?? "", file.mimeType ?? ""))
            ])
        ],
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response;
}