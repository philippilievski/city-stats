import {signalStore, withMethods} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {inject} from '@angular/core';
import {EventService} from './event.service';
import {pipe, switchMap, tap} from 'rxjs';
import {MessageService} from 'primeng/api';
import {CityStore} from '../map/stores/city.store';
import {MarkerStore} from '../map/stores/marker.store';

export const EventStore = signalStore(
  withMethods((store, eventService = inject(EventService),
               messageService = inject(MessageService),
               cityStore = inject(CityStore),
               markerStore = inject(MarkerStore)) => {
    const listenForEvents = rxMethod<void>(
      pipe(
        switchMap(() => {
          return eventService.listenForEvent();
        }),
        tap((value: any) => {
          if (value.topic === 'markers') {
            messageService.add({
              severity: 'info',
              summary: 'NEW MARKER',
              detail: 'A new Marker has been added to the map',
              life: 3000
            });
            markerStore.fetchAllMarkers()
          } else if (value.topic === 'cities') {
            messageService.add({
              severity: 'info',
              summary: 'NEW CITY',
              detail: `City ${value.message} has been added`,
              life: 3000
            });
            cityStore.findAll()
          }
        })
      )
    );

    return {
      listenForEvents
    }
  })
)
