import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import type { Response } from 'express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPrompt: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPrompt);
  }
  @Post('basic-prompt-stream')
  async basicPromptStream(
    @Body() basicPrompt: BasicPromptDto, 
    @Res() res: Response,
    //TODO: FILES
  ) {
    const stream = await this.geminiService.basicPromptStream(basicPrompt);
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.text;
      res.write(piece)
    }
    res.end();
  }
}
