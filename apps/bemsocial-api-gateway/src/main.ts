import { NestFactory } from '@nestjs/core'
import { BemSocialApiGatewayModule } from './bemsocial-api-gateway.module'
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
    const app = await NestFactory.create(BemSocialApiGatewayModule)
    app.enableCors({
        origin: ['http://localhost:5173'],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    })
    app.use(cookieParser());

    app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
