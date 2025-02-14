import {City, CityPayload} from "../../data/city"
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {CityService} from '../../city/services/city.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {MarkerMetadata} from '../../data/marker-metadata';
import {MessageService} from 'primeng/api';
import {EventService} from '../../event/event.service';

type CityState = {
  showAddCityDialogOptions: {
    show: boolean;
    markerMetadata?: MarkerMetadata;
  }
  cities: City[]
}

const initialState: CityState = {
  showAddCityDialogOptions: {
    show: false,
    markerMetadata: undefined
  },
  cities: [],
}

export const CityStore = signalStore(
  withState(initialState),
  withMethods((store, cityService = inject(CityService)) => {
    const findAll = rxMethod<void>(
      pipe(
        switchMap(() => {
          return cityService.findAll().pipe(
            tap((cities) => patchState((store), {cities}))
          )
        })
      )
    );

    const create = rxMethod<CityPayload>(
      pipe(
        switchMap((cityPayload) => {
          return cityService.create(cityPayload);
        }),
        switchMap((city: City) => {
          return cityService.distributeCityTitle(city.title)
        }),
        tap(() => findAll()),
      )
    );

    const remove = rxMethod<number>(
      pipe(
        switchMap((id: number) => {
          return cityService.delete(id);
        }),
        tap(() => findAll())
      )
    );

    const setShowAddCityDialog = (show: boolean, markerMetadata?: MarkerMetadata) =>  {
      patchState(store, (state) => ({ showAddCityDialogOptions: { show, markerMetadata } }));
    };

    const addIfNotPresent = (city: City) => {
      patchState(store, (state) => ({ cities: [...state.cities, city] }))
    };

    return {
      findAll,
      create,
      remove,
      addIfNotPresent,
      setShowAddCityDialog,
    }
  }),
);
