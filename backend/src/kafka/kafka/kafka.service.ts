import {Injectable} from '@nestjs/common';
import {Consumer, Kafka, Producer} from 'kafkajs';
import {SseService} from "../../events/sse/sse.service";

@Injectable()
export class KafkaService {
    kafka: Kafka;
    producer: Producer;
    consumer: Consumer;

    constructor(private readonly sseService: SseService) {
        this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['localhost:9092']
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'my-group' });
    }

    async connect() {
        await this.producer.connect();
        await this.consumer.connect();

        await this.consumer.subscribe({ topic: 'cities', fromBeginning: true });
        await this.consumer.subscribe({ topic: 'markers', fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if(message.value){
                    const msg = JSON.parse(message.value.toString());
                    this.sseService.emitEvent({ data: { message: msg, topic} })
                }
            },
        });
    }

    async sendMessage<T>(topic: string, message: T) {
        const data = JSON.stringify(message);
        console.log("Producer sending: ", data);
        await this.producer.send({
            topic,
            messages: [{ value: data }],
        });
    }
}
