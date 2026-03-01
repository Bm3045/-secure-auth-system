import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  // Simple health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      service: 'auth-backend',
      timestamp: new Date().toISOString()
    });
  });
  
  await app.listen(3001);
  console.log('🚀 Backend service running on http://localhost:3001');
}
bootstrap();