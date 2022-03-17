import { Body, Controller, Post } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Controller('api/auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post('refresh-token')
  async refreshToken(@Body() data: string) {
    return await this.refreshTokenService.refreshToken(data);
  }
}
