import { Injectable } from "@nestjs/common";
import type {
  SendOtpRequest,
  VerifyOtpRequest,
} from "@prismcinema/contracts/gen/auth";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { Account } from "prisma/generated/client";
import { OtpService } from "@/modules/otp/otp.service";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  public constructor(
    private readonly authRepo: AuthRepository,
    private readonly otpService: OtpService,
  ) {}

  public async sendOtp(data: SendOtpRequest) {
    const { identifier, type } = data;

    let account: Account | null;

    if (type === "phone") account = await this.authRepo.findByPhone(identifier);
    else account = await this.authRepo.findByEmail(identifier);

    if (!account) {
      account = await this.authRepo.createAccount({
        phone: type === "phone" ? identifier : null,
        email: type === "email" ? identifier : null,
      });
    }

    const code = await this.otpService.send(
      identifier,
      type as "phone" | "email",
    );

    console.debug("Code:", code);

    return { ok: true };
  }

  public async verifyOtp(data: VerifyOtpRequest) {
    const { identifier, code, type } = data;

    await this.otpService.verify(identifier, code, type as "phone" | "email");

    let account: Account | null;

    if (type === "phone") account = await this.authRepo.findByPhone(identifier);
    else account = await this.authRepo.findByEmail(identifier);

    if (!account) {
      throw new RpcException("Account not found");
    }

    if (type === "phone" && !account.isPhoneVerified) {
      await this.authRepo.updateAccount(account.id, {
        isPhoneVerified: true,
      });
    }

    if (type === "email" && !account.isEmailVerified) {
      await this.authRepo.updateAccount(account.id, {
        isPhoneVerified: true,
      });
    }

    return { accessToken: "123456", refreshToken: "123456" };
  }
}
