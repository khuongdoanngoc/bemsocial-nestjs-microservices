import { SetMetadata } from '@nestjs/common'

export const RABBIT_HANDLER = 'RABBIT_HANDLER'
export const RABBIT_RPC_HANDLER = 'RABBIT_RPC_HANDLER'

export interface RabbitSubscribeOptions {
    exchange: string
    routingKey: string
    queue: string
}

export interface RabbitRPCOptions {
    exchange: string
    routingKey: string
    queue: string
}

export const RabbitSubscribe = (options: RabbitSubscribeOptions) =>
    SetMetadata(RABBIT_HANDLER, { ...options, type: 'subscribe' })

export const RabbitRPC = (options: RabbitRPCOptions) => SetMetadata(RABBIT_RPC_HANDLER, { ...options, type: 'rpc' })

export const RabbitMQPayload = () => (target: any, propertyName: string | symbol | undefined, parameterIndex: number) => {
    // Placeholder parameter decorator - actual parameter extraction handled by RabbitMQ service
}
