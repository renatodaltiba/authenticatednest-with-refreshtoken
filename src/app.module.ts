import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, RefreshTokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
