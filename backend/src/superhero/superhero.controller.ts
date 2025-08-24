import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Delete,
    Patch,
    UseInterceptors,
    UploadedFiles,
    ParseIntPipe,
    Query,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageSaveOptions } from '../superhero-image/image-upload.options';
import { SuperheroService } from './superhero.service';

@Controller('superhero')
export class SuperheroesController {
    constructor(private readonly service: SuperheroService) {}

    private getBaseUrl(req: Request) {
        return `${req.protocol}://${req.get('host')}`;
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 5, imageSaveOptions))
    create(@Body() dto: CreateSuperheroDto, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        const baseUrl = this.getBaseUrl(req);
        return this.service.create(dto, files, baseUrl);
    }

    @Get()
    findAll(@Query('page') page: string, @Query('limit') limit: string) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 5;
        return this.service.findAll(pageNumber, limitNumber);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images', 5, imageSaveOptions))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSuperheroDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        const baseUrl = this.getBaseUrl(req);
        return this.service.update(id, dto, files, baseUrl);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
