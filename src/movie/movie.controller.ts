import { Roles } from './../auth/decorators/auth.decorator';
import { MovieService } from './movie.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create.movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.movieService.findBySlug(slug);
  }

  @Get('by-actor/:actorId')
  async findByActor(@Param('actorId') actorId: number) {
    return this.movieService.findByActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  async findByGenres(
    @Body('genreIds')
    genreIds: number[],
  ) {
    return this.movieService.findByGenres(genreIds);
  }

  @Get()
  async getMovies(@Query('search') search?: string) {
    return this.movieService.getMovies(search);
  }

  @Post('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get('most-popular')
  async getMostPopularMovie() {
    return await this.movieService.getMostPopularMovie();
  }

  @Get(':id')
  @Roles('admin')
  async getMovie(@Param('id') id: number) {
    return this.movieService.findById(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }
}
