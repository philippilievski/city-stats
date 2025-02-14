import {Injectable} from '@angular/core';
import {Location} from '../../data/location';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getCurrentLocation(cb: (location: Location) => void): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        cb({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }
    );
  }

}
