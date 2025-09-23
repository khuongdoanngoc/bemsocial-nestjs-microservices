import { NestFactory } from '@nestjs/core'
import { PostServiceModule } from './post-service.module'

async function bootstrap() {
    const app = await NestFactory.create(PostServiceModule)
    
    // Start the application
    await app.init()
    
    console.log('🚀 Post Service is running...')
    console.log('📡 Connected to RabbitMQ and ready to handle messages')
}

bootstrap().catch((error) => {
    console.error('❌ Failed to start Post Service:', error)
    process.exit(1)
})
