import {IsNotEmpty, IsString} from 'class-validator';

export class CreateSuperheroDto {
    @IsString()
    @IsNotEmpty({ message: 'Nickname should not be empty' })
    nickname: string;

    @IsString()
    real_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Origin Description should not be empty' })
    origin_description: string;

    @IsString()
    superpowers: string;

    @IsString()
    catch_phrase: string;
}
