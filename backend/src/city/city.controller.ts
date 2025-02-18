import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Sse} from '@nestjs/common';
import {City, MarkerMetadata} from '@prisma/client';
import {CityService} from './city.service';
import {Observable} from "rxjs";
import {SseService} from "../events/sse/sse.service";

export interface CityPayload {
    city: City;
    connectToMarker: MarkerMetadata;
}

@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) {
    }

    @Delete('/all')
    removeAll() {
        return this.cityService.removeAll();
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.cityService.remove(id);
    }

    @Post()
    create(@Body() payload: CityPayload): Promise<City> {
        return this.cityService.create(payload);
    }

    @Get()
    findAll(): Promise<City[]> {
        return this.cityService.findAll();
    }

    @Post('/event/distribute-city')
    async distributeCity(@Body() city: City) {
        await this.cityService.distributeCity(city);
        return { status: 'Message sent to Kafka' };
    }

}
