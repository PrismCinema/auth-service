import {Injectable, Logger,type OnModuleDestroy,type OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "../../../prisma/generated/client.js";
import {PrismaPg} from "@prisma/adapter-pg";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PrismaService  extends PrismaClient implements OnModuleInit,OnModuleDestroy{


    public constructor(private readonly configService: ConfigService) {
        const adapter = new PrismaPg({
            user: configService.getOrThrow<string>('POSTGRES_USER'),
            password:configService.getOrThrow<string>('POSTGRES_PASSWORD'),
            host:configService.getOrThrow<string>('POSTGRES_HOST'),
            port:configService.getOrThrow<number>('POSTGRES_PORT'),
            database:configService.getOrThrow<string>('POSTGRES_DATABASE'),
        })

        super({adapter})
    }


    private readonly logger = new Logger(PrismaService.name);

    public async onModuleInit(){
        const start = Date.now();

        this.logger.log(`Connecting to Prisma Service...`);

        try{
            await this.$connect()

            const ms = Date.now() - start;

            this.logger.log(`Database (time=${ms}ms)`)
        }catch (e){
            this.logger.error('Failed to connect to database' , e)

            throw e;
        }
    }

    public async onModuleDestroy(){
        this.logger.log('Disconnecting fro database')

        try{
            await this.$disconnect()

            this.logger.log('Database connection close')
        }catch (e){
            this.logger.error('Failed to Disconnecting to database' , e)

            throw e;
        }
    }
}
