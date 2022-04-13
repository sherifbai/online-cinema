import { genSlug } from './../configs/slug.config';
import { UpdateGenreDto } from './dto/update.genre.dto';
import { GenreEntity } from './genre.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like } from 'typeorm';
import { CreateGenreDto } from './dto/create.genre.dto';
import { GENRE_NOT_FOUND_ERROR } from './genre.error.constants';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,
  ) {}

  async getGenres(search?: string): Promise<GenreEntity[]> {
    let options = {};

    if (search) {
      options = {
        where: [
          { name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
          { slug: Like(`%${search}%`) },
        ],
      };
    }

    return await this.genreRepo.find(options);
  }

  async create({
    name,
    description,
    icon,
  }: CreateGenreDto): Promise<GenreEntity> {
    const genre = this.genreRepo.create({
      name: name.trim(),
      description: description.trim(),
      icon: icon,
      slug: await genSlug(name),
    });

    return await this.genreRepo.save(genre);
  }

  async update(
    id: number,
    { name, description, icon }: UpdateGenreDto,
  ): Promise<GenreEntity> {
    const genre = await this.findById(id);

    if (name) {
      genre.name = name.trim();
      genre.slug = await genSlug(name);
    }

    if (description) {
      genre.description = description;
    }

    if (icon) {
      genre.icon = icon;
    }

    return await this.genreRepo.save(genre);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.genreRepo.delete(id);
  }

  async findById(id: number): Promise<GenreEntity> {
    const genre = await this.genreRepo.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
    }

    return genre;
  }

  async findBySlug(slug: string): Promise<GenreEntity> {
    const genre = await this.genreRepo.findOne({ where: { slug } });
    if (!genre) {
      throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
    }

    return genre;
  }
}
