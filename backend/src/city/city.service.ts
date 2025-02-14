import {Injectable} from '@nestjs/common';
import {City} from '@prisma/client';
import {PrismaService} from "../services/prisma/prisma.service";
import {CityPayload} from "./city.controller";
import {KafkaService} from "../kafka/kafka/kafka.service";

@Injectable()
export class CityService {

    constructor(private readonly prisma: PrismaService,
                private readonly kafkaService: KafkaService) {
    }

    create(payload: CityPayload): Promise<City> {
        return this.prisma.city.create({
            data: {
                title: payload.city.title,
                population: payload.city.population,
                marker: {
                    connect: {
                        id: payload.connectToMarker.id
                    }
                }
            },
        });
    };

    remove(id: number): Promise<City> {
        return this.prisma.city.delete({
            where: {
                id
            }
        })
    };

    findAll(): Promise<City[]> {
        return this.prisma.city.findMany({
            include: {
                marker: true
            }
        });
    }

    async distributeCityName(title: string) {
        await this.kafkaService.sendMessage<string>('cities', title);
    }
}

