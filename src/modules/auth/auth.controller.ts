import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {GrpcMethod} from "@nestjs/microservices";
import type {SendOtpRequest, SendOtpResponse} from "@prismcinema/contracts/gen/auth";

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService','SendOtp')
  public async sendOtp(data:SendOtpRequest):Promise<SendOtpResponse> {

    console.log('Otp:' , data)
    return { ok:true };
  }
}
