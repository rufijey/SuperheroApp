import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Superhero } from './superhero.entity';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { SuperheroImageService } from '../superhero-image/superhero-image.service';

@Injectable()
export class SuperheroService {
    constructor(
        @InjectRepository(Superhero)
        private readonly superheroRepo: Repository<Superhero>,
        private readonly imagesService: SuperheroImageService,
    ) {}

    async create(
        dto: CreateSuperheroDto,
        files: Express.Multer.File[],
        baseUrl: string,
    ): Promise<Superhero> {
        const hero = this.superheroRepo.create(dto);
        await this.superheroRepo.save(hero);

        if (files?.length > 0) {
            hero.images = await this.imagesService.createImages(hero.id, files, baseUrl);
        }

        return hero;
    }

    async findAll(page = 1, limit = 5) {
        const [data, total] = await this.superheroRepo.findAndCount({
            relations: ['images'],
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'ASC' },
        });
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }

    async findOne(id: number): Promise<Superhero> {
        const hero = await this.superheroRepo.findOne({ where: { id }, relations: ['images'] });
        if (!hero) throw new NotFoundException('Superhero not found');
        return hero;
    }

    async update(
        id: number,
        dto: UpdateSuperheroDto,
        files: Express.Multer.File[],
        baseUrl: string,
    ): Promise<Superhero> {
        const hero = await this.findOne(id);

        if (dto.removeImageIds && dto.removeImageIds.length > 0) {
            const pathsToDelete = await this.imagesService.removeImages(dto.removeImageIds);
            await this.imagesService.deleteFiles(pathsToDelete);
            hero.images = hero.images.filter((img) => !dto.removeImageIds!.includes(img.id));
        }

        const { images, ...heroEntity } = hero;
        Object.assign(heroEntity, dto);
        await this.superheroRepo.save(heroEntity);

        if (files?.length > 0) {
            await this.imagesService.createImages(id, files, baseUrl);
        }

        return await this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const hero = await this.findOne(id);

        if (hero.images?.length > 0) {
            const pathsToDelete = await this.imagesService.removeImages(hero.images.map((i) => i.id));
            await this.imagesService.deleteFiles(pathsToDelete);
        }

        await this.superheroRepo.delete(id);
    }
}
