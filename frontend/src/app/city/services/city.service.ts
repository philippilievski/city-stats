import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {City, CityPayload} from '../../data/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  apiUrl = 'http://localhost:3000/city';
  http = inject(HttpClient);

  constructor() {
  }

  create(cityPayload: CityPayload): Observable<City> {
    return this.http.post<City>(`${this.apiUrl}`, cityPayload )
  }

  delete(id: number): Observable<City> {
    return this.http.delete<City>(`${this.apiUrl}/${id}`)
  }

  findAll(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}`);
  }

  distributeCityTitle(title: string) {
    return this.http.post<string>(`${this.apiUrl}/event/distribute-city`, { title });
  }
}
