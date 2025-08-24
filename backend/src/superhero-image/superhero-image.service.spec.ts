import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroImageService } from './superhero-image.service';
import { SuperheroImage } from './superhero-image.entity';
import { Repository, In } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';

jest.mock('fs/promises', () => ({
    unlink: jest.fn(),
}));

describe('SuperheroImageService', () => {
    let service: SuperheroImageService;
    let repo: jest.Mocked<Repository<SuperheroImage>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuperheroImageService,
                {
                    provide: getRepositoryToken(SuperheroImage),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findBy: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SuperheroImageService>(SuperheroImageService);
        repo = module.get(getRepositoryToken(SuperheroImage));
        jest.clearAllMocks();
    });

    describe('createImages', () => {
        it('should create and save images', async () => {
            const superheroId = 1;
            const baseUrl = 'http://localhost:3000';
            const files = [
                { filename: 'img1.png' } as Express.Multer.File,
                { filename: 'img2.png' } as Express.Multer.File,
            ];

            const createdImages = files.map((f, i) => ({
                id: i + 1,
                superhero: { id: superheroId },
                path: f.filename,
                url: `${baseUrl}/static/images/${f.filename}`,
            }));

            repo.create.mockImplementation((dto) => dto as any);
            repo.save.mockResolvedValue(createdImages as any);

            const result = await service.createImages(superheroId, files, baseUrl);

            expect(repo.create).toHaveBeenCalledTimes(2);
            expect(repo.save).toHaveBeenCalledWith(expect.any(Array));
            expect(result).toEqual(createdImages);
        });
    });

    describe('removeImages', () => {
        it('should find, delete and return paths', async () => {
            const imageIds = [1, 2];
            const images = [
                { id: 1, path: 'img1.png' },
                { id: 2, path: 'img2.png' },
            ] as SuperheroImage[];

            repo.findBy.mockResolvedValue(images);
            repo.delete.mockResolvedValue({} as any);

            const result = await service.removeImages(imageIds);

            expect(repo.findBy).toHaveBeenCalledWith({ id: In(imageIds) });
            expect(repo.delete).toHaveBeenCalledWith(imageIds);
            expect(result).toEqual(['img1.png', 'img2.png']);
        });
    });

    describe('deleteFiles', () => {
        it('should call unlink for each path', async () => {
            (unlink as jest.Mock).mockResolvedValue(undefined);

            const paths = ['a.png', 'b.png'];
            await service.deleteFiles(paths);

            expect(unlink).toHaveBeenCalledTimes(2);
            expect(unlink).toHaveBeenCalledWith(join(process.cwd(), 'static', 'images', 'a.png'));
            expect(unlink).toHaveBeenCalledWith(join(process.cwd(), 'static', 'images', 'b.png'));
        });

        it('should log warning if unlink fails', async () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            (unlink as jest.Mock).mockRejectedValue(new Error('File not found'));

            await service.deleteFiles(['bad.png']);

            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to delete file bad.png: File not found'),
            );

            warnSpy.mockRestore();
        });
    });
});
