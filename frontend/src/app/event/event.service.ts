import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  listenForEvent(apiUrl: string = 'http://localhost:3000/event'): Observable<any> {
    return new Observable((observer) => {

      const eventSource = new EventSource(apiUrl);

      eventSource.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        observer.next(JSON.parse(event.data));
      };

      eventSource.onerror = (error) => {
        console.log(error);
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }
}
