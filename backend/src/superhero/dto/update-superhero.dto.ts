import { PartialType } from '@nestjs/mapped-types';
import { CreateSuperheroDto } from './create-superhero.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';
import {Type} from "class-transformer";

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    removeImageIds?: number[];
}
