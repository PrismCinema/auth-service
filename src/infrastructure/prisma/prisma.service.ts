import {Injectable, Logger, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "../../../prisma/generated/client.js";
import {PrismaPg} from "@prisma/adapter-pg";

@Injectable()
export class PrismaService  extends PrismaClient implements OnModuleInit,OnModuleDestroy{


    public constructor() {
        const adapter = new PrismaPg(process.env.POSTGRES_URI!)

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
