import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ChatPrompDto {
    @IsString()
    @IsNotEmpty()
    prompt: string;
    @IsArray()
    @IsOptional()
    files: Express.Multer.File[];
    @IsUUID()
    chatId?: string;
}