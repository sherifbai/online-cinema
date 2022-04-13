import { GenreEntity } from './../genre/genre.entity';
import { ActorEntity } from './../actor/actor.entity';
import { CreateMovieDto } from './dto/create.movie.dto';
import { MovieEntity } from './movie.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository, DeleteResult } from 'typeorm';
import { MOVIE_NOT_FOUND_ERROR } from './errors/movie.error.constants';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
    @InjectRepository(ActorEntity)
    private readonly actorRepo: Repository<ActorEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,
  ) {}

  async getMovies(search?: string): Promise<MovieEntity[]> {
    let options = {};

    if (search) {
      options = {
        where: [{ slug: Like(`%${search}%`) }],
        relations: ['actors', 'genres'],
      };
    }

    return await this.movieRepo.find(options);
  }

  async updateCountOpened(slug: string) {
    const movie = await this.findBySlug(slug);
    movie.count_opened++;

    return await this.movieRepo.save(movie);
  }

  async findByActor(actorId: number): Promise<MovieEntity[]> {
    const actor = await this.actorRepo.findOne(actorId, {relations: ['movies']});

    return actor.movies;
  }

  async findByGenres(genresIds: number[]) {
    const genres = await this.genreRepo.find({ where: { id: In(genresIds) }, relations: ['movies'] });
    return genres.map(genre => genre.movies)[0] ?? [];
  }

  async findBySlug(slug: string): Promise<MovieEntity> {
    const movie = await this.movieRepo.findOne({ where: { slug } });
    if (!movie) {
      throw new NotFoundException(MOVIE_NOT_FOUND_ERROR);
    }

    return movie;
  }

  async findById(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepo.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(MOVIE_NOT_FOUND_ERROR);
    }

    return movie;
  }

  async create({
    poster,
    big_poster,
    actors,
    genres,
    slug,
    video_url,
    description,
    title,
  }: CreateMovieDto): Promise<MovieEntity> {
    const actors_list = await this.actorRepo.findByIds(actors);
    const genres_list = await this.genreRepo.findByIds(genres);

    const movie = this.movieRepo.create({
      title: title.trim(),
      poster: poster,
      big_poster: big_poster,
      slug: slug,
      video_url: video_url,
      description: description,
      actors: actors_list,
      genres: genres_list,
    });

    return await this.movieRepo.save(movie);
  }
  
  async delete(id: number): Promise<DeleteResult> {
    return await this.movieRepo.delete(id);
  }
}
