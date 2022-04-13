import { MovieEntity } from 'src/movie/movie.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MovieEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
