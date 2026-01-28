import { Content, ContentListUnion, createPartFromUri, GoogleGenAI } from "@google/genai";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";
import { ImageGenerationDto } from "../dtos/image-generation.dto";
import {v4 as uuidv4} from 'uuid';
import * as path from "node:path";
import * as fs from "node:fs";

interface Options {
    model?: string;
    systemInstruction?: string;
    history: Content[];
}

export interface ImageGenerationResponse {
    imageUrl: string;
    text: string;
}

const AI_IMAGES_PATH = path.join(__dirname, '..', '..', 'public', 'ai-images');

export const ImageGenerationUseCase = async (ai: GoogleGenAI, imageGeneration: ImageGenerationDto, options?: Options): Promise<ImageGenerationResponse> => {
    const files = imageGeneration.files || [];
    
    const model = options?.model || "gemini-2.5-flash";
    const content: ContentListUnion= [
        {
            text: imageGeneration.prompt,
        }
    ];
    const uploadedFiles = await geminiUploadFiles(ai, files, {transformToPng: true});
    uploadedFiles.forEach(file => {
        content.push(
             createPartFromUri(file.uri ?? '', file.mimeType || ''),
        );
    });

    const response = await ai.models.generateContent({
        model: model,
        contents: content,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        }
    });
    let imageUrl ="";
    let text ="";
    const imageId = uuidv4();

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.text){
            text = part.text;
            continue;
        }
        if(!part.inlineData || !part.inlineData.data){
            continue;
        }
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        const imagePath = path.join(AI_IMAGES_PATH, `${imageId}.png`);
        fs.writeFileSync(imagePath, buffer);
        imageUrl = `${process.env.API_URL}/ai-images/${imageId}.png`;

    }


    return {
        imageUrl: imageUrl,
        text: text,
    }
}