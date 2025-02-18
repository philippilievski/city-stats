import {Component, inject, OnInit} from '@angular/core';
import {CityStore} from '../../map/stores/city.store';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {DecimalPipe, TitleCasePipe} from '@angular/common';
import {MarkerMetadata} from '../../data/marker-metadata';
import {MapStore} from '../../map/stores/map.store';
import * as Leaflet from 'leaflet';
import {LatLng} from 'leaflet';

@Component({
  selector: 'app-city-list',
  imports: [
    TableModule,
    Button,
    DecimalPipe,
    TitleCasePipe
  ],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
})
export class CityListComponent implements OnInit{
  cityStore = inject(CityStore);
  mapStore = inject(MapStore);

  ngOnInit(): void {
  }

  flyToLocation(marker: MarkerMetadata) {
    const latLng: LatLng = Leaflet.latLng(marker.lat, marker.lon);
    this.mapStore.flyTo(latLng);
  }
}
