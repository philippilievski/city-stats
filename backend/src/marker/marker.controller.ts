import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {MarkerMetadata, Prisma} from "@prisma/client";
import {MarkerService} from "./marker.service";
import {SseService} from "../events/sse/sse.service";
import {KafkaApiEvent} from "../kafka/kafka/kafka.service";

@Controller('marker')
export class MarkerController {

    constructor(private readonly markerService: MarkerService,
                private readonly sseService: SseService) {
    }

    @Get()
    findAll(): Promise<MarkerMetadata[]> {
        return this.markerService.findAll();
    }

    @Post()
    create(@Body() marker: Prisma.MarkerMetadataCreateInput) {
        return this.markerService.create(marker);
    }

    @Delete('/all')
    removeAll() {
        return this.markerService.removeAll();
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.markerService.remove(id);
    }

    @Post('/event/')
    async distributeCity(@Body() data: { markerMetadata: MarkerMetadata, event: KafkaApiEvent }) {
        await this.markerService.distributeMarkerMetadata(data.markerMetadata, data.event);
        return {status: 'Message sent to Kafka'};
    }
}
