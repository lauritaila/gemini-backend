import { Content, createPartFromUri, GoogleGenAI } from "@google/genai";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";
import { ImageGenerationDto } from "../dtos/image-generation.dto";
import { Interface } from "readline";
import { text } from "stream/consumers";

interface Options {
    model?: string;
    systemInstruction?: string;
    history: Content[];
}

export interface ImageGenerationResponse {
    imageUrl: string;
    text: string;
}

export const ImageGenerationUseCase = async (ai: GoogleGenAI, imageGeneration: ImageGenerationDto, options?: Options): Promise<ImageGenerationResponse> => {
    const files = imageGeneration.files || [];

    const uploadedFiles = await geminiUploadFiles(ai, files);

    const model = options?.model || "gemini-2.5-flash";
    const systemInstruction = options?.systemInstruction || "responde en ingles de manera concisa y clara. en formato markdown";

    return {
        imageUrl: "https://example.com/generated-image.png",
        text: "Image generated successfully."
    }
}