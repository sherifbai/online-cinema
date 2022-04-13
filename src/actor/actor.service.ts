import { genSlug } from './../configs/slug.config';
import { UpdateActorDto } from './dto/update.actor.dto';
import { CreateActorDto } from './dto/create.actor.dto';
import { ActorEntity } from './actor.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like } from 'typeorm';
import { ACTOR_NOT_FOUND_ERROR } from './actor.error.constants';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(ActorEntity)
    private readonly actorRepo: Repository<ActorEntity>,
  ) {}

  async getActors(search?: string): Promise<ActorEntity[]> {
    let options = {};

    if (search) {
      options = {
        where: [{ name: Like(`%${search}%`) }, { slug: Like(`%${search}%`) }],
      };
    }

    return await this.actorRepo.find(options);
  }

  async create({ name, photo }: CreateActorDto): Promise<ActorEntity> {
    const actor = this.actorRepo.create({
      name: name.trimEnd(),
      photo: photo,
      slug: await genSlug(name),
    });

    return await this.actorRepo.save(actor);
  }

  async update(
    id: number,
    { name, photo }: UpdateActorDto,
  ): Promise<ActorEntity> {
    const actor = await this.findById(id);

    if (name) {
      actor.name = name.trim();
      actor.slug = await genSlug(name);
    }

    if (photo) {
      actor.photo = photo;
    }

    return await this.actorRepo.save(actor);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.actorRepo.delete(id);
  }

  async findBySlug(slug: string): Promise<ActorEntity> {
    const actor = await this.actorRepo.findOne({ where: { slug } });
    if (!actor) {
      throw new NotFoundException(ACTOR_NOT_FOUND_ERROR);
    }

    return actor;
  }

  async findById(id: number): Promise<ActorEntity> {
    const actor = await this.actorRepo.findOne({ where: { id } });
    if (!actor) {
      throw new NotFoundException(ACTOR_NOT_FOUND_ERROR);
    }

    return actor;
  }
}
