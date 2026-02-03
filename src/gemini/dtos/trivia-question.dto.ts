import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TriviaQuestionDto {
    @IsString()
    @IsNotEmpty()
    topic: string;
}