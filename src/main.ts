import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import type { AllConfigs } from "@/config";
import { PROTO_PATHS } from "@prismcinema/contracts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<AllConfigs>);

  const host = config.get("grpc.host", { infer: true });
  const port = config.get("grpc.port", { infer: true });

  const url = `${host}:${port}`;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "auth.v1",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      protoPath: PROTO_PATHS.AUTH,
      url,
      logging: {
        keepCase: false,
        longs: String,
        enums: String,
        default: true,
        oneofs: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.init(); //initialisation di container
}
bootstrap();
