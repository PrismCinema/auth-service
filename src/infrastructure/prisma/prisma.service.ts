import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from "@nestjs/config";
import type { AllConfigs } from "@/config";
import { PrismaClient } from "prisma/generated/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public constructor(
    private readonly configService: ConfigService<AllConfigs>,
  ) {
    const adapter = new PrismaPg({
      user: configService.get("database.user", { infer: true }),
      password: configService.get("database.password", { infer: true }),
      host: configService.get("database.host", { infer: true }),
      port: configService.get("database.port", { infer: true }),
      database: configService.get("database.name", { infer: true }),
    });

    super({ adapter });
  }

  private readonly logger = new Logger(PrismaService.name);

  public async onModuleInit() {
    const start = Date.now();

    this.logger.log(`Connecting to Prisma Service...`);

    try {
      await this.$connect();

      const ms = Date.now() - start;

      this.logger.log(`Database (time=${ms}ms)`);
    } catch (e) {
      this.logger.error("Failed to connect to database", e);

      throw e;
    }
  }

  public async onModuleDestroy() {
    this.logger.log("Disconnecting fro database");

    try {
      await this.$disconnect();

      this.logger.log("Database connection close");
    } catch (e) {
      this.logger.error("Failed to Disconnecting to database", e);

      throw e;
    }
  }
}
