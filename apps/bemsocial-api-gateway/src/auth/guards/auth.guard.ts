import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (isPublic) return true

        try {
            const request = context.switchToHttp().getRequest()
            const token = await this.extractTokenFromHeader(request)
            if (!token) {
                throw new UnauthorizedException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' })
            }
            const decoded = await this.validateToken(token)
            if (!decoded)
                throw new UnauthorizedException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' })
            request.user = decoded
            return true
        } catch (error) {
            throw new UnauthorizedException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' })
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.get('Authorization')?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }

    private async validateToken(token: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            })
            return decoded
        } catch (error) {
            throw new UnauthorizedException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' })
        }
    }
}
