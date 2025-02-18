import {AfterContentInit, Component, effect, inject} from '@angular/core';
import * as Leaflet from "leaflet";
import {MapStore} from '../stores/map.store';
import {Button} from 'primeng/button';
import {CityStore} from '../stores/city.store';
import {AddCityDialogComponent} from '../../city/add-city-dialog/add-city-dialog.component';
import {Card} from 'primeng/card';
import {CityListComponent} from '../../city/city-list/city-list.component';
import {MarkerStore} from '../../marker/stores/marker.store';
import {EventStore} from '../../event/event.store';

@Component({
  selector: 'app-map',
  imports: [
    Button,
    AddCityDialogComponent,
    Card,
    CityListComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterContentInit {
  readonly mapStore = inject(MapStore);
  readonly cityStore = inject(CityStore);
  readonly markerStore = inject(MarkerStore);
  readonly eventStore = inject(EventStore);

  ngAfterContentInit(): void {
    this.markerStore.fetchAllMarkers();
    this.cityStore.findAll();
    this.mapStore.setMap(Leaflet.map('map').setView([48, 10], 5));

    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.mapStore.map());

    this.eventStore.listenForEvents();
  }

  flyToMyLocation() {
    this.mapStore.flyToMyLocation(false);
  }
}
