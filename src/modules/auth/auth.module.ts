import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {AuthRepository} from "@/modules/auth/auth.repository";
import {OtpService} from "@/modules/otp/otp.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService,AuthRepository, OtpService],
})
export class AuthModule {}
