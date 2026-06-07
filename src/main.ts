import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options:{
      package: 'auth.v1',
      protoPath: 'node_modules/@prismcinema/contracts/proto/auth.proto',
      url: 'localhost:50051',
      logging: {
        keepCase:false,
        longs:String,
        enums:String,
        default:true,
        oneofs:true,
      }
    }
  })


  await app.startAllMicroservices()
  await app.init() //initialisation di container

}
bootstrap();
