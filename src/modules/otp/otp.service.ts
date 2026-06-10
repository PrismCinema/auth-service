import { Injectable } from "@nestjs/common";
import { RedisService } from "@/infrastructure/redis/redis.service";
import { createHash } from "node:crypto";

@Injectable()
export class OtpService {
  public constructor(private readonly redisService: RedisService) {}

  public async send(identifier: string, type: "phone" | "email") {
    const { code, hash } = this.generateCode();


    await this.redisService.set(`otp${type} : ${identifier}`, hash, "EX", 300);

    return code;
  }

  private generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    const hash = createHash("sha256").update(String(code)).digest("hex");

    return { code, hash };
  }
}
