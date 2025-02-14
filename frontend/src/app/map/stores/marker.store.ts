import {CreateMarkerMetadataDTO, MarkerMetadata} from '../../data/marker-metadata';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {MarkerService} from '../../marker/marker.service';
import {MessageService} from 'primeng/api';
import {EventService} from '../../event/event.service';

type MarkerState = {
  markerMetadataList: MarkerMetadata[];
}

const initialState: MarkerState = {
  markerMetadataList: [],
}

export const MarkerStore = signalStore(
  withState(initialState),
  withMethods((store, markerService = inject(MarkerService),
               eventService = inject(EventService),
               messageService = inject(MessageService)) => {
    const fetchAllMarkers = rxMethod<void>(
      pipe(
        switchMap(() => {
          return markerService.findAll()
        }),
        tap((markerMetadataList: MarkerMetadata[]) =>
          patchState(store, (state) => ({markerMetadataList: [...state.markerMetadataList, ...markerMetadataList]}))
        )
      )
    );

    const create = rxMethod<CreateMarkerMetadataDTO>(
      pipe(
        switchMap((markerMetadata: CreateMarkerMetadataDTO) => {
          return markerService.create(markerMetadata);
        }),
        tap((markerMetadata) => addMarker(markerMetadata)),
        switchMap((markerMetadata) => {
          return markerService.distributeMarkerMetadata(markerMetadata)
        }),
        tap(() => fetchAllMarkers())
      )
    );

    const remove = rxMethod<number>(
      pipe(
        switchMap((id: number) => {
          return markerService.delete(id);
        })
      )
    );

    const addMarker = (markerMetadata: MarkerMetadata) => {
      patchState(store, (state) => ({markerMetadataList: [...state.markerMetadataList, markerMetadata]}))
    };

    return {
      fetchAllMarkers,
      create,
      remove
    }
  })
)
