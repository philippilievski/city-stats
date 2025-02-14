import {MarkerMetadata} from './marker-metadata';

export interface City {
  id: string;
  title: string;
  population: number;
  markerMetadata?: MarkerMetadata;
}

export interface CityPayload {
  city: CreateCityDTO;
  connectToMarker?: MarkerMetadata;
}

export type CreateCityDTO = Omit<City, 'id'>;
