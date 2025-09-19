import { Module } from '@nestjs/common'
import { RabbitMQService } from './rabbitmq.service'

@Module({
    imports: [],
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export class RabbitmqModule {}
