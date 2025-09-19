import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { RabbitMQService } from './rabbitmq.service'

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export class RabbitMQModule {}
