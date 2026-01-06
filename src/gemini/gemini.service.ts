import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    async basicPrompt(basicPrompt: BasicPromptDto) {
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: basicPrompt.prompt,
            config:{
                systemInstruction: "responde en ingles de manera concisa y clara. en formato markdown",
            }
        });
        console.log(response.text);
        return { response: response.text };
    }
}
