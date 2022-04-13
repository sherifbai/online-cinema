import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { USER_EXIST_ERROR } from './errors/auth.errors.constants';
import { IUserResponse } from './types/user.response.interface';
import { Roles } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('registration')
  async registration(
    @Body() { email, password }: AuthDto,
  ): Promise<IUserResponse> {
    const existUser = await this.authService.findUserByEmail(email);

    if (existUser) {
      throw new BadRequestException(USER_EXIST_ERROR);
    }

    const user = await this.authService.registration({ email, password });

    return { user };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() { email, password }: AuthDto) {
    const user = await this.authService.validateUser({ email, password });

    return await this.authService.login(user);
  }
}
