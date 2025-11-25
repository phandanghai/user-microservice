import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './user.controller';
import { UserService } from './user.service';

import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: PrismaClient,
      useExisting: PrismaService,
    },
    ConfigService,
  ],
})
export class AppModule {}
