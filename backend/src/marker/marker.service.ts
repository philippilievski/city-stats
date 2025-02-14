import {Injectable} from '@nestjs/common';
import {PrismaService} from "../services/prisma/prisma.service";
import {MarkerMetadata, Prisma} from "@prisma/client";
import {KafkaService} from "../kafka/kafka/kafka.service";

@Injectable()
export class MarkerService {
    constructor(private readonly prisma: PrismaService,
                private readonly kafkaService: KafkaService) {
    }

    findAll(): Promise<MarkerMetadata[]> {
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

    async distributeMarkerMetadata(markerMetadata: MarkerMetadata) {
        await this.kafkaService.sendMessage<MarkerMetadata>('markers', markerMetadata);
    }
}
