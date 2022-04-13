import { IGetActorsInterface } from './types/get.actors.interface';
import { DeleteResult } from 'typeorm';
import { UpdateActorDto } from './dto/update.actor.dto';
import { IGetActorResponse } from './types/get.actor.interface';
import { CreateActorDto } from './dto/create.actor.dto';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { ActorService } from './actor.service';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async getActors(
    @Query('search') search?: string,
  ): Promise<IGetActorsInterface> {
    return { actors: await this.actorService.getActors(search) };
  }

  @Get('by-slug/:slug')
  async getActorBySlug(
    @Param('slug') slug: string,
  ): Promise<IGetActorResponse> {
    return { actor: await this.actorService.findBySlug(slug) };
  }

  @Roles('admin')
  @Get(':id')
  async getActor(@Param('id') id: number): Promise<IGetActorResponse> {
    return { actor: await this.actorService.findById(id) };
  }

  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @Post()
  async create(
    @Body() createActorDto: CreateActorDto,
  ): Promise<IGetActorResponse> {
    return { actor: await this.actorService.create(createActorDto) };
  }

  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<IGetActorResponse> {
    return { actor: await this.actorService.update(id, updateActorDto) };
  }

  @Roles('admin')
  @HttpCode(200)
  @Delete('id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    await this.actorService.findById(id);
    return await this.actorService.delete(id);
  }
}
