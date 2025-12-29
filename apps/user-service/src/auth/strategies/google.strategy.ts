import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, StrategyOptionsWithRequest, VerifyCallback } from 'passport-google-oauth20'
import { AuthService } from '../auth.service'
import { PROVIDERS } from '@app/contracts/dtos/enums/providers.enum'
import { User } from '../schemas/user.schema'
import { RpcException } from '@nestjs/microservices'
import { HttpStatus } from '@nestjs/common'
    
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        } as StrategyOptionsWithRequest)
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        try {
            const { id, name, emails, photos } = profile
            const user = {
                googleId: id,
                email: emails?.[0]?.value,
                firstName: name?.givenName,
                lastName: name?.familyName,
                avatar: photos?.[0]?.value,
                provider: PROVIDERS.GOOGLE,
            }
            const result = await this.authService.handleGoogleValidate(user as User)
            done(null, result)
        } catch (error) {
            console.log('Error validating user', error)
            done(new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to validate user',
            }))
        }
    }
}
