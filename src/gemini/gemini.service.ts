import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Content, GoogleGenAI } from '@google/genai';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';
import { ChatPrompDto } from './dtos/chat-promp.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    private chatHistory = new Map<String, Content[]>();

    async basicPrompt(basicPrompt: BasicPromptDto) {
        return basicPromptUseCase(this.ai, basicPrompt);
    }
    async basicPromptStream(basicPrompt: BasicPromptDto) {
        return basicPromptStreamUseCase(this.ai, basicPrompt);
    }
    async chatPromptStream(chatPrompt: ChatPrompDto) {
        const chathistory = this.getChatHistory(chatPrompt.chatId!);
        return chatPromptStreamUseCase(this.ai, chatPrompt, {history: chathistory});
    }

    saveMessage(chatId: string, message: Content){
        const messages =  this.getChatHistory(chatId);
        messages.push(message);
        this.chatHistory.set(chatId, messages);
    }

    getChatHistory(chatId: string){
        return structuredClone(this.chatHistory.get(chatId) || []);

    }
}
