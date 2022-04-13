import { UserEntity } from './../../user/user.entity';
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HAVE_NOT_PERMISSION_ERROR } from '../errors/auth.errors.constants';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    if (!user.is_admin) {
      throw new ForbiddenException(HAVE_NOT_PERMISSION_ERROR);
    }

    return user.is_admin
  }
}
