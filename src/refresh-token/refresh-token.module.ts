import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [AuthModule],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, PrismaService],
})
export class RefreshTokenModule {}
