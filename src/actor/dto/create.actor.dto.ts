import { IsString } from 'class-validator';
export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  photo: string;
}
