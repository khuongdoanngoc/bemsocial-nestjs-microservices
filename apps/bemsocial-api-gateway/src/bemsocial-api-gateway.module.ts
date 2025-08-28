import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [AuthModule, ProfileModule],
})
export class BemSocialApiGatewayModule {}
