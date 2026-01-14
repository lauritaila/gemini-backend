import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPrompDto } from "../dtos/chat-promp.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (ai: GoogleGenAI, chatPrompt: ChatPrompDto, options?: Options) => {
    const files = chatPrompt.files || [];

    const uploadedFiles = await geminiUploadFiles(ai, files);
 
    const model = options?.model || "gemini-2.5-flash";
    const systemInstruction = options?.systemInstruction || "responde en ingles de manera concisa y clara. en formato markdown";
    
    const chat = ai.chats.create({
    model: model,
    config: {
        systemInstruction: systemInstruction,
    },
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

    return chat.sendMessageStream({
        message:[
            chatPrompt.prompt,
            ...uploadedFiles.map((file) => createPartFromUri(file.uri ?? "", file.mimeType ?? ""))
        ]
    });
}