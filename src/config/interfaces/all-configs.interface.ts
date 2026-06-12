import type { GrpcConfig } from "@/config/interfaces/grpc.interface";
import type { DatabaseConfig } from "@/config/interfaces/database.interface";
import { RedisConfig } from "@/config/interfaces/redis.interface";

export interface AllConfigs {
  database: DatabaseConfig;
  grpc: GrpcConfig;
  redis: RedisConfig;
}
