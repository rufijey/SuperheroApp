import { IsString } from 'class-validator';

export class CreateSuperheroDto {
    @IsString()
    nickname: string;

    @IsString()
    real_name: string;

    @IsString()
    origin_description: string;

    @IsString()
    superpowers: string;

    @IsString()
    catch_phrase: string;
}
