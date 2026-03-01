import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
})
export class AppModule {}