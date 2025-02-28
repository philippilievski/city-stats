import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateMarkerMetadataDTO, MarkerMetadata} from '../data/marker-metadata';
import {KafkaApiEvent} from '../event/event.store';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  apiUrl = 'http://localhost:3000/marker';
  http = inject(HttpClient);

  constructor() {
  }

  create(marker: CreateMarkerMetadataDTO): Observable<MarkerMetadata> {
    return this.http.post<MarkerMetadata>(`${this.apiUrl}`, marker);
  }

  findAll(): Observable<MarkerMetadata[]> {
    return this.http.get<MarkerMetadata[]>(`${this.apiUrl}`);
  }

  delete(id: number): Observable<MarkerMetadata> {
    return this.http.delete<MarkerMetadata>(`${this.apiUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/all`)
  }

  distributeMarkerEvent(event: KafkaApiEvent, markerMetadata: MarkerMetadata) {
    return this.http.post<string>(`${this.apiUrl}/event/`, {markerMetadata, event})
  }
}
