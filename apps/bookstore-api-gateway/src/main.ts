import { NestFactory } from '@nestjs/core'
import { BookstoreApiGatewayModule } from './bookstore-api-gateway.module'
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http.filter'

async function bootstrap() {
    const app = await NestFactory.create(BookstoreApiGatewayModule)
    app.useGlobalFilters(new RpcToHttpExceptionFilter())
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
