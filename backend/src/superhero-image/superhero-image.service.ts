import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import { SuperheroImage } from './superhero-image.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class SuperheroImageService {
    constructor(
        @InjectRepository(SuperheroImage)
        private readonly imageRepo: Repository<SuperheroImage>,
    ) {}

    async createImages(
        superheroId: number,
        files: Express.Multer.File[],
        baseUrl: string,
    ): Promise<SuperheroImage[]> {
        const images = files.map((file) =>
            this.imageRepo.create({
                superhero: { id: superheroId },
                path: file.filename,
                url: `${baseUrl}/static/images/${file.filename}`,
            }),
        );
        return await this.imageRepo.save(images);
    }

    async removeImages(imageIds: number[]): Promise<string[]> {
        const images = await this.imageRepo.findBy({ id: In(imageIds) });
        await this.imageRepo.delete(imageIds);
        return images.map((img) => img.path);
    }

    async deleteFiles(imagePaths: string[]) {
        for (const path of imagePaths) {
            try {
                await unlink(join(process.cwd(), 'static', 'images', path));
            } catch (err) {
                console.warn(`Failed to delete file ${path}: ${err.message}`);
            }
        }
    }
}
