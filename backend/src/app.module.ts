import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { CategoryModule } from 'modules/category/category.module';
import * as path from 'path';

import { AchievementsModule } from '@m/achievements/achievements.module';
import { AuthModule } from '@m/auth/auth.module';
import { RolesGuard } from '@m/auth/guards/roles.guard';
import { EventModule } from '@m/event/event.module';
import { StatsModule } from '@m/stats/stats.module';
import { UserModule } from '@m/user/user.module';
import { VerificationModule } from '@m/verification/verification.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URL),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../../build/static'),
        }),
        UserModule,
        EventModule,
        CategoryModule,
        AuthModule,
        VerificationModule,
        StatsModule,
        AchievementsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        if (process.env.NODE_ENV !== 'production') {
            consumer.apply(LoggerMiddleware).forRoutes('*');
        }
    }
}
