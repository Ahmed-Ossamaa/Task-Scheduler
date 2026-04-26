import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/users/users.module';
import { TasksModule } from './features/tasks/tasks.module';
import { AuthModule } from './features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import dbConfig from './config/db.config';
import googleAuthConfig from './config/oAuth.config';
import redisConfig from './config/redis.config';
import cloudinaryConfig from './config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { validationSchema } from './config/validation.schema';
import { OrganizationsModule } from './features/organizations/organizations.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ProjectsModule } from './features/projects/projects.module';
import { AnalyticsModule } from './features/analytics/analytics.module';
import { ActivityModule } from './features/activity/activity.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { BackgroundJobsModule } from './features/background-jobs/background-jobs.module';
import mailConfig from './config/mail.config';
import { MailModule } from './integrations/mail/mail.module';
import { ContactMessagesModule } from './features/contact-messages/contact-messages.module';
import { SystemSettingsModule } from './features/system-settings/system-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [
        appConfig,
        jwtConfig,
        dbConfig,
        redisConfig,
        googleAuthConfig,
        cloudinaryConfig,
        mailConfig,
      ],
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

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    UserModule,
    TasksModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    AnalyticsModule,
    ActivityModule,
    BackgroundJobsModule,
    MailModule,
    ContactMessagesModule,
    SystemSettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
