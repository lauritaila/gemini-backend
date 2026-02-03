import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PokemonHelperDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}