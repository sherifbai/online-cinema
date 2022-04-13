import { UserEntity } from './../user/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './errors/auth.errors.constants';
import { JwtService } from '@nestjs/jwt';
import { ITokenResponse } from './types/token.response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registration({ email, password }: AuthDto): Promise<UserEntity> {
    const salt = await genSalt(10);

    const user = this.userRepo.create({
      email: email.trim(),
      password: await hash(password, salt),
    });

    return await this.userRepo.save(user);
  }

  async login(user: UserEntity): Promise<ITokenResponse> {
    const payload = {
      email: user.email,
      id: user.id,
      is_admin: user.is_admin,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser({ email, password }: AuthDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { email } });
  }
}
