import { Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import type { Response } from 'express';
import { ChatPrompDto } from './dtos/chat-promp.dto';
import { GenerateContentResponse } from '@google/genai';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(res: Response, stream: AsyncGenerator<GenerateContentResponse, any, any>) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);
    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece)
    }
    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPrompt: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPrompt);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('file'))
  async basicPromptStream(
    @Body() basicPrompt: BasicPromptDto, 
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    basicPrompt.files = files ?? [];
    const stream = await this.geminiService.basicPromptStream(basicPrompt);
    this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('file'))
  async chatStream(
    @Body() chatPrompt: ChatPrompDto, 
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    chatPrompt.files = files ?? [];
    const stream = await this.geminiService.chatPromptStream(chatPrompt);
    const data = await this.outputStreamResponse(res, stream);
    return data;
  }
}
