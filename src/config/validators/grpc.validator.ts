import { IsNumber, IsString } from "class-validator";

export class GrpcValidator {
  @IsString()
  public GRPC_HOST: string;

  @IsNumber()
  public GRPC_PORT: number;
}
