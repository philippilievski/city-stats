import {Controller, Sse} from '@nestjs/common';
import {Observable} from "rxjs";
import {SseService} from "../sse.service";

@Controller('event')
export class EventController {
    constructor(private readonly sseService: SseService) {
    }

    @Sse()
    sseEvents(): Observable<unknown> {
        return this.sseService.getEvents();
    }
}
