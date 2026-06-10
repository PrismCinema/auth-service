import { Module } from "@nestjs/common";
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { RedisModule } from './infrastructure/redis/redis.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, PrismaModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
