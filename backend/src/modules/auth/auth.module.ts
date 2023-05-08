import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AchievementsModule } from '@m/achievements/achievements.module';
import { UserModule } from '@m/user/user.module';
import { VerificationModule } from '@m/verification/verification.module';

import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './passport-strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } }),
        UserModule,
        PassportModule,
        VerificationModule,
        AchievementsModule,
    ],
    controllers: [AuthController],
    providers: [JwtStrategy],
})
export class AuthModule {}
