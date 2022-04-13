import { GenreEntity } from './../genre/genre.entity';
import { ActorEntity } from './../actor/actor.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieEntity } from './movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([ MovieEntity, ActorEntity, GenreEntity ])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
