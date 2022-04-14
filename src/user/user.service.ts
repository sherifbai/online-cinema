import { MovieEntity } from 'src/movie/movie.entity';
import { UpdateProfile } from './dto/update.profile';
import { UserEntity } from './user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult } from 'typeorm';
import { genSaltSync, hash } from 'bcrypt';
import {
  ALREADY_EXIST_EMAIL_ERROR,
  USER_NOT_FOUND_ERROR,
} from './errors.constants';
import { MOVIE_NOT_FOUND_ERROR } from 'src/movie/movie.error.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
  ) {}

  async getProfile(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['movies'],
    });
    console.log(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async updateProfile(
    id: number,
    { email, password, is_admin }: UpdateProfile,
  ): Promise<UserEntity> {
    const user = await this.getProfile(id);
    const isSameUser = await this.userRepo.findOne({ where: { email } });

    if (isSameUser && user.id !== isSameUser.id) {
      throw new BadRequestException(ALREADY_EXIST_EMAIL_ERROR);
    }

    if (password) {
      const genSalt = genSaltSync(10);
      user.password = await hash(password, genSalt);
    }

    user.email = email;

    if (is_admin || is_admin === false) {
      user.is_admin = is_admin;
    }

    return await this.userRepo.save(user);
  }

  async getCountUsers(): Promise<number> {
    return await this.userRepo.count();
  }

  async getAllUsers(search?: string): Promise<UserEntity[]> {
    let options = {};

    if (search) {
      options = {
        where: [{ email: Like(`%${search}%`) }],
      };
    }

    return await this.userRepo.find(options);
  }

  async deleteProfile(id: number): Promise<DeleteResult> {
    return this.userRepo.delete(id);
  }

  async addToFavorite(
    movieId: number,
    { id }: UserEntity,
  ): Promise<UserEntity> {
    const movie = await this.movieRepo.findOne({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException(MOVIE_NOT_FOUND_ERROR);
    }

    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['movies'],
    });

    user.movies = [...user.movies, movie];

    return await this.userRepo.save(user);
  }

  async deleteFromFavorites(
    movieId: number,
    { id }: UserEntity,
  ) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['movies'] });

    user.movies = user.movies.filter((movie) => {
      return !(movieId === movie.id);
    });

    return await this.userRepo.save(user);
  }

  async favorites({ id }: UserEntity): Promise<MovieEntity[]> {
    const movies = await this.movieRepo.find({
      where: { user_id: id },
      relations: ['actors', 'genres'],
    });
    return movies;
  }
}
