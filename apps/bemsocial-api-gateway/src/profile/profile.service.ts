import { PROFILE_PATTERN } from '@app/contracts/dtos/profile/profile.pattern'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class ProfileService {
    constructor(@Inject('PROFILE_SERVICE') private readonly client: ClientProxy) {}

    async getProfileByUserId(userId: string): Promise<GetProfileResponseDto> {
        return await lastValueFrom(
            this.client 
                .send(PROFILE_PATTERN.GET_PROFILE, { userId })
                .pipe(map(response => response as GetProfileResponseDto)),
        )
    }

    async updateProfileByUserID(userId: string): Promise<void> {
        await lastValueFrom(this.client.send(PROFILE_PATTERN.UPDATE_PROFILE, { userId }).pipe(map(() => null)))
    }
}
