import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class Parameters {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  poster?: string;

  @IsString()
  @IsOptional()
  big_poster?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsObject()
  @IsOptional()
  parameters?: Parameters;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsArray({ each: true })
  @IsNumber()
  @IsOptional()
  actors?: number[];

  @IsArray({ each: true })
  @IsNumber()
  @IsOptional()
  genres?: number[];

  @IsBoolean()
  @IsOptional()
  is_send_telegram?: boolean;
}
