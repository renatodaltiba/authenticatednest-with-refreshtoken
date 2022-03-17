import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const refreshToken = await this.createToken(user.id);

    return {
      token: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async refreshToken(id: string) {
    const payload = {
      sub: id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async createToken(userId: string) {
    const expiresIn = dayjs().add(12, 'hours').unix();

    const generatedToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        expiresAt: expiresIn,
      },
    });

    return generatedToken;
  }

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.findOneByEmail(email);
    } catch (err) {
      return null;
    }

    const isPasswordMatched = compareSync(password, user.password);
    if (!isPasswordMatched) {
      return null;
    }

    return user;
  }
}
