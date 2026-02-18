import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import dbConfig from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from './config/redis.config';
import {validationSchema} from './config/validation.schema'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [jwtConfig, dbConfig, redisConfig],
    }),


    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (db: ReturnType<typeof dbConfig>) => {
        if (db.url) {
          return {
            type: 'postgres',
            url: db.url,
            autoLoadEntities: db.autoLoadEntities,
            synchronize: db.synchronize,
          };
        }

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.pass,
          database: db.name,
          autoLoadEntities: db.autoLoadEntities,
          synchronize: db.synchronize,
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (redis: ReturnType<typeof redisConfig>) => ({
        connection: redis.connection,
        defaultJobOptions: redis.defaultJobOptions,


      }),
    }),
    UserModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
