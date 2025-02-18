import {Injectable} from '@nestjs/common';
import {Consumer, Kafka, Producer} from 'kafkajs';
import {SseService} from "../../events/sse/sse.service";

export type KafkaApiEvent = 'create' | 'delete';

@Injectable()
export class KafkaService {
    kafka: Kafka;
    producer: Producer;
    cityConsumer: Consumer;
    markerConsumer: Consumer;

    constructor(private readonly sseService: SseService) {
        this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['localhost:9092']
        });

        this.producer = this.kafka.producer();
        this.cityConsumer = this.kafka.consumer({ groupId: 'city-group' });
        this.markerConsumer = this.kafka.consumer({ groupId: 'marker-group' });
    }

    async connect() {
        const admin = this.kafka.admin();
        await admin.connect();
        const topicMetadata = await admin.listTopics();

        if (!topicMetadata.includes('cities')) {
            await admin.createTopics({ topics: [{ topic: 'cities', numPartitions: 3 }] });
        }
        if (!topicMetadata.includes('markers')) {
            await admin.createTopics({ topics: [{ topic: 'markers', numPartitions: 3 }] });
        }
        await admin.disconnect();

        await this.producer.connect();
        await this.cityConsumer.connect();
        await this.markerConsumer.connect();

        await this.cityConsumer.subscribe({ topic: 'cities', fromBeginning: true });
        await this.markerConsumer.subscribe({ topic: 'markers', fromBeginning: true });

        await this.cityConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if(message.value){
                    const msg = JSON.parse(message.value.toString());
                    console.log("Consumer receiving", msg);
                    this.sseService.emitEvent({ data: { message: msg, topic} });
                }
            },
        });

        await this.markerConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if(message.value){
                    const msg = JSON.parse(message.value.toString());
                    console.log("Consumer receiving", msg);
                    this.sseService.emitEvent({ data: { message: msg, topic} });
                }
            },
        });
    }

    async sendMessage<T>(topic: string, data: T, event?: KafkaApiEvent) {
        const message = JSON.stringify({data, event});
        console.log("Producer sending: ", message);
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
    }
}
