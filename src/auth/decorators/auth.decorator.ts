import { RolesGuard } from './../guards/roles.guard';
import { JwtAuthGuard } from './../guards/jwt.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesType } from '../types/roles.type';

export const Roles = (role: RolesType) => applyDecorators(
  role === 'admin' 
  ? UseGuards(JwtAuthGuard, RolesGuard) 
  : UseGuards(JwtAuthGuard));
