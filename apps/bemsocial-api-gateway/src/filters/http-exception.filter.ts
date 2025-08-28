import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse()
        const status = exception.getStatus?.() ?? HttpStatus.BAD_REQUEST
        const response = exception.getResponse?.()
        let message: any

        if (typeof response === 'string') {
            message = response
        } else if (response && typeof response === 'object' && 'message' in (response as any)) {
            message = (response as any).message
        } else {
            message = (exception as any)?.message || 'Bad Request'
        }

        res.status(status).json({ statusCode: status, message })
    }
}
