import { IsOptional, IsString } from 'class-validator';
export class UpdateActorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
