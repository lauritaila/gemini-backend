import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPrompt: BasicPromptDto, options?: Options) => {
    const files = basicPrompt.files || [];

    const images = await Promise.all(
        files.map( (file) => {
            const blobPart = file.buffer instanceof ArrayBuffer ? file.buffer : new Uint8Array(file.buffer);
            return ai.files.upload({
                file: new Blob([blobPart], { type: file.mimetype.includes("image") ? file.mimetype : "image/jpeg" }),
            });
        }))

    const model = options?.model || "gemini-2.5-flash";
    const systemInstruction = options?.systemInstruction || "responde en ingles de manera concisa y clara. en formato markdown";

    const response = await ai.models.generateContentStream({
        model: model,
        contents: [
            createUserContent([
                basicPrompt.prompt,
                ...images.map((image) => createPartFromUri(image.uri ?? "", image.mimeType ?? ""))
            ])
        ],
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response;
}