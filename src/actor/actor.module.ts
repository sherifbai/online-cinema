import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ActorEntity } from './actor.entity';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActorEntity])],
  controllers: [ActorController],
  providers: [ActorService],
  exports: [TypeOrmModule.forFeature([ActorEntity])],
})
export class ActorModule {}
