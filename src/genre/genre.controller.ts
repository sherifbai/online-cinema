import { DeleteResult } from 'typeorm';
import { UpdateGenreDto } from './dto/update.genre.dto';
import { IGetGenresResponse } from './types/get.genres.interface';
import { IGetGenreResponse } from './types/get.genre.interface';
import { GenreService } from './genre.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { CreateGenreDto } from './dto/create.genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getGenres(
    @Query('search') search?: string,
  ): Promise<IGetGenresResponse> {
    return { genres: await this.genreService.getGenres(search) };
  }

  @Get('by-slug/:slug')
  async getGenreBySlug(
    @Param('slug') slug: string,
  ): Promise<IGetGenreResponse> {
    return { genre: await this.genreService.findBySlug(slug) };
  }

  @Roles('admin')
  @Get(':id')
  async getGenre(@Param('id') id: number): Promise<IGetGenreResponse> {
    return { genre: await this.genreService.findById(id) };
  }

  @Roles('admin')
  @Post()
  async create(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<IGetGenreResponse> {
    return { genre: await this.genreService.create(createGenreDto) };
  }

  @Roles('admin')
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<IGetGenreResponse> {
    return { genre: await this.genreService.update(id, updateGenreDto) };
  }

  @Roles('admin')
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    await this.genreService.findById(id);
    return this.genreService.delete(id);
  }
}
