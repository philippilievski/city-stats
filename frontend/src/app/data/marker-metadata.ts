import {City} from './city';

export interface MarkerMetadata {
  id: number;
  lat: number;
  lon: number;
  city: City;
}

export type CreateMarkerMetadataDTO = Omit<MarkerMetadata, 'id' | 'city'>
