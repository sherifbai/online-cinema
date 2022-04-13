import { UserEntity } from './../user/user.entity';
import { GenreEntity } from './../genre/genre.entity';
import { ActorEntity } from './../actor/actor.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Parameters {
  @Column()
  year: number;

  @Column()
  duration: number;

  @Column()
  country: string;
}

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  poster: string;

  @Column()
  big_poster: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  // @Column()
  // parameters?: Parameters;

  @Column({ default: 4.0 })
  rating?: number;

  @Column({ unique: true })
  video_url: string;

  @Column({ default: 0 })
  count_opened: number;

  @ManyToMany(() => ActorEntity, actors => actors.id, { cascade: true })
  @JoinTable({ name: 'movies_actors' })
  actors: ActorEntity[];

  @ManyToMany(() => GenreEntity, genres => genres.id, { cascade: true })
  @JoinTable({ name: 'movies_genres' })
  genres: GenreEntity[];

  @ManyToOne(() => UserEntity, user_id => user_id.id, { cascade: true })
  @JoinColumn({name : 'user_id'})
  user_id: UserEntity;

  @Column({ default: false })
  is_send_telegram?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
