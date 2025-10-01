import { NestFactory } from '@nestjs/core'
import { BemSocialApiGatewayModule } from './bemsocial-api-gateway.module'
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

async function bootstrap() {
    const app = await NestFactory.create(BemSocialApiGatewayModule)
    app.enableCors({
        origin: ['http://localhost:5173'],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    })
    app.use(cookieParser())

    // Increase the payload size limit to handle larger requests
    app.use(bodyParser.json({ limit: '10mb' }))
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

    app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
