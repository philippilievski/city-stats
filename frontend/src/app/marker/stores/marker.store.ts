import {CreateMarkerMetadataDTO, MarkerMetadata} from '../../data/marker-metadata';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {MarkerService} from '../marker.service';

type MarkerState = {
  markerMetadataList: MarkerMetadata[];
}

const initialState: MarkerState = {
  markerMetadataList: [],
}

export const MarkerStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, markerService = inject(MarkerService)) => {
    const fetchAllMarkers = rxMethod<void>(
      pipe(
        switchMap(() => {
          return markerService.findAll()
        }),
        tap((markerMetadataList: MarkerMetadata[]) => {
          patchState(store, (state) => ({markerMetadataList: [...markerMetadataList]}));
        })
      )
    );

    const create = rxMethod<CreateMarkerMetadataDTO>(
      pipe(
        switchMap((markerMetadata: CreateMarkerMetadataDTO) => {
          return markerService.create(markerMetadata);
        }),
        tap((markerMetadata) => patchAddUnique(markerMetadata)),
        switchMap((markerMetadata) => {
          return markerService.distributeMarkerEvent('create', markerMetadata);
        })
      )
    );

    const remove = rxMethod<number>(
      pipe(
        switchMap((id: number) => {
          return markerService.delete(id);
        }),
        switchMap((markerMetadata) => {
          return markerService.distributeMarkerEvent('delete', markerMetadata);
        })
      )
    );

    const removeAll = rxMethod<void>(
      pipe(
        switchMap(() => {
          return markerService.deleteAll()
        }),
        tap(() => {
          console.log("deleting:", store.markerMetadataList())
          patchState(store, (state) => ({markerMetadataList: []}))
        })
      )
    );

    const patchAddUnique = (markerMetadata: MarkerMetadata) => {
      if (!store.markerMetadataList().some((mmd) => mmd.id === markerMetadata.id)) {
        patchState(store, (state) => ({
          markerMetadataList: [...state.markerMetadataList, markerMetadata]
        }));
      }
    };

    const patchRemove = (markerMetadata: MarkerMetadata) => {
      if(store.markerMetadataList().some((mmd) => mmd.id === markerMetadata.id)) {
        patchState(store, (state) => ({
          markerMetadataList: state.markerMetadataList.filter((mmd) => mmd.id !== markerMetadata.id)
        }));
      }
    };

    return {
      fetchAllMarkers,
      create,
      remove,
      patchAddUnique,
      patchRemove,
      removeAll
    }
  })
)
