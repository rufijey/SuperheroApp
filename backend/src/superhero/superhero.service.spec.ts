import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroService } from './superhero.service';
import { Superhero } from './superhero.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuperheroImageService } from '../superhero-image/superhero-image.service';
import { NotFoundException } from '@nestjs/common';

describe('SuperheroesService', () => {
    let service: SuperheroService;
    let repo: jest.Mocked<Repository<Superhero>>;
    let imageService: jest.Mocked<SuperheroImageService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuperheroService,
                {
                    provide: getRepositoryToken(Superhero),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findAndCount: jest.fn(),
                        findOne: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: SuperheroImageService,
                    useValue: {
                        createImages: jest.fn(),
                        removeImages: jest.fn(),
                        deleteFiles: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SuperheroService>(SuperheroService);
        repo = module.get(getRepositoryToken(Superhero));
        imageService = module.get(SuperheroImageService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create hero without images', async () => {
            const dto = { nickname: 'Batman' } as any;
            const hero = { id: 1, ...dto, images: [] } as Superhero;

            repo.create.mockReturnValue(hero);
            repo.save.mockResolvedValue(hero);

            const result = await service.create(dto, [], 'http://localhost:3000');

            expect(repo.create).toHaveBeenCalledWith(dto);
            expect(repo.save).toHaveBeenCalledWith(hero);
            expect(result).toEqual(hero);
        });

        it('should create hero with images', async () => {
            const dto = { nickname: 'Spiderman' } as any;
            const hero = { id: 2, ...dto, images: [] } as Superhero;
            const files = [{ filename: 'a.png' }] as Express.Multer.File[];

            repo.create.mockReturnValue(hero);
            repo.save.mockResolvedValue(hero);
            imageService.createImages.mockResolvedValue([{ id: 1, path: 'a.png' }] as any);

            const result = await service.create(dto, files, 'http://localhost:3000');

            expect(imageService.createImages).toHaveBeenCalledWith(2, files, 'http://localhost:3000');
            expect(result.images).toEqual([{ id: 1, path: 'a.png' }]);
        });
    });

    describe('findAll', () => {
        it('should return paginated heroes', async () => {
            const heroes = [{ id: 1 }, { id: 2 }] as Superhero[];
            repo.findAndCount.mockResolvedValue([heroes, 2] as any);

            const result = await service.findAll(1, 2);

            expect(repo.findAndCount).toHaveBeenCalledWith({
                relations: ['images'],
                skip: 0,
                take: 2,
                order: { id: 'ASC' },
            });
            expect(result).toEqual({ data: heroes, total: 2, page: 1, lastPage: 1 });
        });
    });

    describe('findOne', () => {
        it('should return hero', async () => {
            const hero = { id: 1 } as Superhero;
            repo.findOne.mockResolvedValue(hero);

            const result = await service.findOne(1);

            expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['images'] });
            expect(result).toBe(hero);
        });

        it('should throw if hero not found', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update hero and remove images', async () => {
            const hero = {
                id: 1,
                nickname: 'Ironman',
                images: [{ id: 10, path: 'old.png' }],
            } as any;

            repo.findOne.mockResolvedValue(hero);
            imageService.removeImages.mockResolvedValue(['old.png']);
            imageService.deleteFiles.mockResolvedValue();

            repo.save.mockResolvedValue({ ...hero, nickname: 'NewName' } as any);

            const dto = { nickname: 'NewName', removeImageIds: [10] } as any;
            const result = await service.update(1, dto, [], 'http://localhost:3000');

            expect(imageService.removeImages).toHaveBeenCalledWith([10]);
            expect(imageService.deleteFiles).toHaveBeenCalledWith(['old.png']);
            expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ nickname: 'NewName' }));
            expect(result).toBeTruthy();
        });

        it('should add new images', async () => {
            const hero = { id: 1, nickname: 'Thor', images: [] } as any;
            repo.findOne.mockResolvedValue(hero);
            repo.save.mockResolvedValue(hero);
            imageService.createImages.mockResolvedValue([{ id: 99, path: 'new.png' }] as any);

            const files = [{ filename: 'new.png' }] as Express.Multer.File[];

            await service.update(1, { nickname: 'Thor' } as any, files, 'http://localhost:3000');

            expect(imageService.createImages).toHaveBeenCalledWith(1, files, 'http://localhost:3000');
        });
    });

    describe('remove', () => {
        it('should remove hero with images', async () => {
            const hero = { id: 1, images: [{ id: 5, path: 'x.png' }] } as any;
            repo.findOne.mockResolvedValue(hero);
            imageService.removeImages.mockResolvedValue(['x.png']);
            imageService.deleteFiles.mockResolvedValue();

            await service.remove(1);

            expect(imageService.removeImages).toHaveBeenCalledWith([5]);
            expect(imageService.deleteFiles).toHaveBeenCalledWith(['x.png']);
            expect(repo.delete).toHaveBeenCalledWith(1);
        });

        it('should remove hero without images', async () => {
            const hero = { id: 2, images: [] } as any;
            repo.findOne.mockResolvedValue(hero);

            await service.remove(2);

            expect(repo.delete).toHaveBeenCalledWith(2);
        });
    });
});
