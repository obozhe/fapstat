import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Settings } from 'luxon';

import { AppModule } from './app.module';

async function bootstrap() {
    Settings.defaultZone = 'utc';

    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.use(cookieParser());
    app.use(compression());

    app.use(
        helmet({
            xssFilter: true,
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'img-src': ["'self'", 'cdn.jsdelivr.net/npm/emoji-datasource-apple', 'https: data: blob:'],
                },
            },
        })
    );

    const config = new DocumentBuilder().addCookieAuth('jwt').setTitle('Fapstat API').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/swagger', app, document);

    await app.listen(process.env.PORT || 5050);
}
bootstrap();
