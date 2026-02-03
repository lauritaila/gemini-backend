import { Body, Controller, Get, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import type { Response } from 'express';
import { ChatPrompDto } from './dtos/chat-promp.dto';
import { GenerateContentResponse } from '@google/genai';
import { ImageGenerationDto } from './dtos/image-generation.dto';
import { PokemonHelperDto } from './dtos/pokemon-helper.dto';
import { TriviaQuestionDto } from './dtos/trivia-question.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }

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
    const geminiMessage = {
      role: 'model',
      text: [{ text: data }],
    };
    const userMessage = {
      role: 'user',
      text: [{ text: chatPrompt.prompt }],
    };
    this.geminiService.saveMessage(chatPrompt.chatId!, userMessage);
    this.geminiService.saveMessage(chatPrompt.chatId!, geminiMessage);
    return data;
  }

  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map(message => ({
      role: message.role,
      parts: message.parts?.map(part => part.text).join(''),
    }));
  }

  @Post('image-generation')
  @UseInterceptors(FilesInterceptor('file'))
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    imageGenerationDto.files = files ?? [];
    const {imageUrl, text} = await this.geminiService.imageGeneration(imageGenerationDto);
    return { imageUrl, text };

  }

  @Post('pokemon-helper')
  async getPokemonHelp(@Body() pokemonHelperDto: PokemonHelperDto) {
    return this.geminiService.getPokemonHelp(pokemonHelperDto);
  }

  @Get('trivia/question/:topic')
  async getTriviaQuestion(@Param() triviaQuestionDto: TriviaQuestionDto) {
    return this.geminiService.getTriviaQuestion(triviaQuestionDto);
  }

}
