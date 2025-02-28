import {Location} from '../../data/location';
import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import * as Leaflet from "leaflet";
import {LatLng, LeafletMouseEvent, Map, Marker} from "leaflet";
import {MapService} from '../map/map.service';
import {effect, inject} from '@angular/core';
import {MarkerStore} from '../../marker/stores/marker.store';
import {
  CreateMarkerMetadataDTO,
  MarkerMetadata,
  MarkerWithMarkerMetadata
} from '../../data/marker-metadata';
import {CityStore} from './city.store';

type MapState = {
  map: Map;
  userLocation: Location;
  markersOnMapWithMetadata: MarkerWithMarkerMetadata[];
};

const initialState: MapState = {
  map: {} as Map,
  markersOnMapWithMetadata: [],
  userLocation: {
    lat: 0,
    lon: 0
  }
};

export const MapStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, mapService = inject(MapService), markerStore = inject(MarkerStore), cityStore = inject(CityStore)) => ({
    setMap(map: Map): void {
      patchState(store, (state) => ({map}));

      map.on('click', (event: LeafletMouseEvent) => {
        const latLng: LatLng = event.latlng;

        const markerMetadata: CreateMarkerMetadataDTO = {
          lat: latLng.lat,
          lon: latLng.lng
        };
        markerStore.create(markerMetadata);
      });
    },
    addMarkerToMap(markerWithMarkerMetadata: MarkerWithMarkerMetadata): void {
      const { marker, markerMetadata } = markerWithMarkerMetadata;
      patchState(store, (state) => ({markersOnMapWithMetadata: [...state.markersOnMapWithMetadata, markerWithMarkerMetadata]}))
      const icon = Leaflet.divIcon({
        className: 'custom-div-icon',
        html: `
          <div data-testid="test-icon">
            <img
              src="/marker-icon.png"
              alt="marker icon"
              style="width: 25px; height: 41px;"
            />
          </div>
        `,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      marker.setIcon(icon);
      marker.addTo(store.map());

      marker.on('click', (event: LeafletMouseEvent) => {
        cityStore.setShowAddCityDialog(true, markerMetadata);
      });

      marker.on('contextmenu', (event: LeafletMouseEvent) => {
        this.removeMarkerFromMap({marker, markerMetadata});
        markerStore.remove(markerMetadata.id);
      });

      marker.on('mouseover', (event: LeafletMouseEvent) => {
        if (markerMetadata.city) {
          marker.bindTooltip(markerMetadata.city.title);
        }
      });
    },
    removeMarkerFromMap(markerWithMarkerMetadata: MarkerWithMarkerMetadata): void {
      const { marker, markerMetadata } = markerWithMarkerMetadata;
      marker.remove();
      patchState(store, (state) => ({markersOnMapWithMetadata: state.markersOnMapWithMetadata.filter((markersOnMap) => markersOnMap.markerMetadata.id !== markerMetadata.id)}));
    },
    setUserLocation(location: Location): void {
      patchState(store, (state) => ({userLocation: location}))
    },
    flyToMyLocation(addMarker: boolean): void {
      mapService.getCurrentLocation((location) => {
        this.setUserLocation(location);
        const latLng: LatLng = Leaflet.latLng(location.lat, location.lon);
        this.flyTo(latLng);

        if (!addMarker) {
          return;
        }
      })
    },
    flyTo(latLng: LatLng): void {
      store.map().flyTo(latLng, 10);
    },
  })),
  withHooks({
    onInit(store) {
      const markerStore = inject(MarkerStore);
      let oldMarkerMetadataList: MarkerMetadata[] = [];

      effect(() => {
        const markerMetadataList = markerStore.markerMetadataList();
        const removedMarkerMetadata = oldMarkerMetadataList.filter(oldMarkerMetadata => !markerMetadataList.some(markerMetadata => markerMetadata.id === oldMarkerMetadata.id));
        const newMarkerMetadata = markerMetadataList.filter(markerMetadata => !oldMarkerMetadataList.some(oldMarkerMetadata => oldMarkerMetadata.id === markerMetadata.id));

        oldMarkerMetadataList = [...markerMetadataList];

        newMarkerMetadata.forEach((markerMetadata) => {
          const latLng: LatLng = Leaflet.latLng({lat: markerMetadata.lat, lng: markerMetadata.lon})
          const marker: Marker = Leaflet.marker(latLng);

          store.addMarkerToMap({marker, markerMetadata});
        });

        removedMarkerMetadata.forEach((markerMetadata) => {
          const markerWithMarkerMetadata = store.markersOnMapWithMetadata().find((m) => m.markerMetadata.id === markerMetadata.id);
          if(markerWithMarkerMetadata) {
            store.removeMarkerFromMap(markerWithMarkerMetadata);
          }
        })
      });
    }
  })
);
