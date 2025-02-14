import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Sse} from '@nestjs/common';
import {MarkerMetadata, Prisma} from "@prisma/client";
import {MarkerService} from "./marker.service";
import {Observable} from "rxjs";
import {SseService} from "../events/sse/sse.service";

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

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.markerService.remove(id);
    }

    @Post('/event/')
    async distributeCity(@Body() markerMetadata: MarkerMetadata ) {
        console.log(markerMetadata);
        await this.markerService.distributeMarkerMetadata(markerMetadata);
        return { status: 'Message sent to Kafka' };
    }
}
