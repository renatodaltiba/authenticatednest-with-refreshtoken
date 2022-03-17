import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async refreshToken(data: any) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        id: data.refresh_token,
      },
    });

    if (!refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresAt),
    );

    const { token } = await this.authService.refreshToken(refreshToken.userId);

    if (refreshTokenExpired) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId: refreshToken.userId,
        },
      });

      const generatedRefreshTokenProvider = await this.authService.createToken(
        refreshToken.userId,
      );

      return {
        token,
        refresh_token: generatedRefreshTokenProvider,
      };
    }

    return { token };
  }
}
