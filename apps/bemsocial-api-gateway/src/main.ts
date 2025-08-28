import { NestFactory } from '@nestjs/core'
import { BemSocialApiGatewayModule } from './bemsocial-api-gateway.module'
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters/http-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(BemSocialApiGatewayModule)
    app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
