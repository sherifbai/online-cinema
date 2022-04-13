import { GenreController } from './genre.controller';
import { GenreEntity } from './genre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [TypeOrmModule.forFeature([GenreEntity])],
})
export class GenreModule {}
