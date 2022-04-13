import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfile {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;  
}
