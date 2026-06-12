import { registerAs } from "@nestjs/config";
import { validateEnv } from "@/shared/utils";
import { GrpcValidator } from "@/config/validators";
import { GrpcConfig } from "@/config/interfaces/grpc.interface";

export const grpcEnv = registerAs<GrpcConfig>("grpc", () => {
  validateEnv(process.env, GrpcValidator);

  return {
    host: process.env.GRPC_HOST,
    port: parseInt(process.env.GRPC_PORT),
  };
});
