import { DeleteResult } from 'typeorm';
import { IGetUsersResponse } from './types/get.users.interface';
import { IUpdatedProfileResponse } from './types/updated.profile.interface';
import { IUpdatedUserResponse } from './types/update.user.interface';
import { ICountUserResponse } from './types/count.users.interface';
import { UpdateProfile } from './dto/update.profile';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { IGetUserResponse } from './types/get.user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('user')
  @Get('profile')
  async getProfile(@User('id') { id }: UserEntity) {
    return await this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('user')
  @Put('profile')
  async updateProfile(
    @User('id') { id }: UserEntity,
    @Body() { email, password, is_admin }: UpdateProfile,
  ): Promise<IUpdatedProfileResponse> {
    console.log('profile');
    const user = await this.userService.updateProfile(id, {
      email,
      password,
      is_admin,
    });
    return { updated_profile: user };
  }

  @Get()
  @Roles('admin')
  async getAllUsers(@Query('search') search?: string): Promise<IGetUsersResponse> {
    const users = await this.userService.getAllUsers(search);
    return { users };
  }

  @Get('count')
  @Roles('admin')
  async getCountUsers(): Promise<ICountUserResponse> {
    const counts = await this.userService.getCountUsers();
    return { user_counts: counts };
  }

  @Get(':id')
  @Roles('admin')
  async getUser(@Param('id') id: number): Promise<IGetUserResponse> {
    const user = await this.userService.getProfile(id);
    return { user };
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('admin')
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() { email, password, is_admin }: UpdateProfile,
  ): Promise<IUpdatedUserResponse> {
    console.log('user');
    const user = await this.userService.updateProfile(id, {
      email,
      password,
      is_admin,
    });
    return { updated_user: user };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteProfile(@Param('id') id: number): Promise<DeleteResult> {
    await this.userService.getProfile(id);
    return this.userService.deleteProfile(id);
  }

  @Put('profile/favorite')
  @HttpCode(200)
  @Roles('user')
  async addToFavorite(@Body('movieId') id: number, @User() user: UserEntity) {
    return this.userService.addToFavorite(id, user);
  }

  @Get('profile/favorites')
  @Roles('user')
  async favorites(@User() user: UserEntity) {
    return await this.userService.favorites(user);
  }
}
