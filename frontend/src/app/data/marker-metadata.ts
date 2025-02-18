import {City} from './city';
import {Marker} from 'leaflet';

export interface MarkerMetadata {
  id: number;
  lat: number;
  lon: number;
  city: City;
}

export interface MarkerWithMarkerMetadata {
  marker: Marker;
  markerMetadata: MarkerMetadata;
}

export type CreateMarkerMetadataDTO = Omit<MarkerMetadata, 'id' | 'city'>
