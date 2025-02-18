import {Injectable} from '@nestjs/common';
import {PrismaService} from "../services/prisma/prisma.service";
import {MarkerMetadata, Prisma} from "@prisma/client";
import {KafkaApiEvent, KafkaService} from "../kafka/kafka/kafka.service";

@Injectable()
export class MarkerService {
    constructor(private readonly prisma: PrismaService,
                private readonly kafkaService: KafkaService) {
    }

    async findAll(): Promise<MarkerMetadata[]> {
        return this.prisma.markerMetadata.findMany({
            include: {
                city: true
            }
        });
    }

    create(marker: Prisma.MarkerMetadataCreateInput) {
        return this.prisma.markerMetadata.create({data: marker})
    }

    remove(id: number): Promise<MarkerMetadata> {
        return this.prisma.markerMetadata.delete({
            where: {
                id
            }
        })
    };

    removeAll(): Promise<Prisma.BatchPayload> {
        return this.prisma.markerMetadata.deleteMany();
    }

    async distributeMarkerMetadata(markerMetadata: MarkerMetadata, event: KafkaApiEvent) {
        await this.kafkaService.sendMessage<MarkerMetadata>('markers', markerMetadata, event);
    }
}
