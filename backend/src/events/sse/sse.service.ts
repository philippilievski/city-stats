import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
    private eventSubject = new Subject<any>();

    emitEvent(data: unknown) {
        this.eventSubject.next(data);
    }

    getEvents(): Observable<any> {
        return this.eventSubject.asObservable();
    }
}
