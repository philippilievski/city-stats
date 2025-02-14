import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {KafkaService} from "./kafka/kafka/kafka.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);

  const kafkaService = app.get(KafkaService);
  kafkaService.connect().catch((err) => {
    console.error('Error connecting Kafka:', err);
  });
}
bootstrap();
