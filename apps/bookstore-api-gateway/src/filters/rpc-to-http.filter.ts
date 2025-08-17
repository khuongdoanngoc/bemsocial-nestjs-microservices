// apps/bookstore-api-gateway/src/common/filters/rpc-to-http.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse()
        const status =
            exception?.status ||
            exception?.statusCode ||
            (exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_GATEWAY)
        const message = Array.isArray(exception?.message)
            ? exception.message.join(', ')
            : exception?.message || (exception instanceof HttpException ? exception.message : 'Upstream service error')
        res.status(status).json({ statusCode: status, message })
    }
}
