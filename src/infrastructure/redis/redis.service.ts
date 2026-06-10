import {Injectable, Logger, type OnModuleDestroy, type OnModuleInit} from '@nestjs/common';
import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class RedisService extends Redis implements OnModuleInit , OnModuleDestroy{

    private readonly logger = new Logger(RedisService.name);

    public constructor(private readonly configService: ConfigService) {
        super({
            username: configService.getOrThrow<string>('REDIS_USER'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            maxRetriesPerRequest: 5,
            enableOfflineQueue: true,
        })
    }

    public async onModuleInit(){
        const start = Date.now();

        this.logger.log(`Connecting to Redis Service...`);


             this.on('connect', () => {
                 this.logger.log(`Redis connecting ...`);
             })

            this.on('ready', () =>{

                const ms = Date.now() - start;

                this.logger.log(`Database (time=${ms}ms)`)
            })

        this.on('error',(err) => {
            this.logger.error('Redis Error', {
                error: err.message ?? err
            })
        })


        this.on('close', () => {
            this.logger.log(`Redis connection Closed`);
        })

        this.on('reconnecting', () => {
            this.logger.log(`Redis reconnecting...`);
        })

    }

    public async onModuleDestroy(){
        this.logger.log('Closing redis connection...');

        try {
            await  this.quit()
            this.logger.log('Redis connection closed');
        }catch (error) {
            this.logger.error('Error closing Redis connection', error )
        }


    }

}
