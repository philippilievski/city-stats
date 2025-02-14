import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CityController} from './city/city.controller';
import {CityService} from './city/city.service';
import {PrismaService} from './services/prisma/prisma.service';
import {MarkerController} from './marker/marker.controller';
import {MarkerService} from './marker/marker.service';
import {KafkaService} from './kafka/kafka/kafka.service';
import {SseService} from './events/sse/sse.service';
import { EventController } from './events/sse/event/event.controller';

@Module({
  controllers: [AppController, CityController, MarkerController, EventController],
  providers: [AppService, CityService, PrismaService, MarkerService, KafkaService, SseService],
})
export class AppModule {}
