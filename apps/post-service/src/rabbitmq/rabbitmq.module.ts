import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { RabbitmqService } from './rabbitmq.service'

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitmqModule {}
