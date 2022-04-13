import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class CreateMovieDto {
  @IsString()
  @IsEmpty()
  poster: string;

  @IsString()
  @IsEmpty()
  big_poster: string;

  @IsString()
  @IsEmpty()
  title: string;

  @IsString()
  @IsEmpty()
  description: string;

  @IsString()
  @IsEmpty()
  slug: string;

  @IsObject()
  parameters?: Parameters;

  @IsString()
  @IsEmpty()
  video_url: string;

  @IsArray({ each: true })
  @IsNumber()
  @IsEmpty()
  actors: number[];

  @IsArray({ each: true })
  @IsNumber()
  @IsEmpty()
  genres: number[];

  @IsBoolean()
  is_send_telegram?: boolean;
}
