import {signalStore, withMethods} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {inject} from '@angular/core';
import {EventService} from './event.service';
import {pipe, switchMap, tap} from 'rxjs';
import {MessageService} from 'primeng/api';
import {CityStore} from '../map/stores/city.store';
import {MarkerStore} from '../marker/stores/marker.store';

export type KafkaApiEvent = 'create' | 'delete';

export interface KafkaEvent {
  topic: string;
  message: {
    data: any;
    event: KafkaApiEvent;
  };
}

export const EventStore = signalStore(
  {providedIn: 'root'},
  withMethods((store, eventService = inject(EventService),
               messageService = inject(MessageService),
               cityStore = inject(CityStore),
               markerStore = inject(MarkerStore)) => {
    const listenForEvents = rxMethod<void>(
      pipe(
        switchMap(() => {
          return eventService.listenForEvent();
        }),
        tap((value: KafkaEvent) => {
          if (value.topic === 'markers') {
            if(value.message.event === 'create') {
              messageService.add({
                severity: 'success',
                summary: 'New Marker',
                detail: 'A new Marker has been added to the map',
                life: 3000
              });
              markerStore.patchAddUnique(value.message.data);
            } else if(value.message.event === 'delete') {
              messageService.add({
                severity: 'warn',
                summary: 'Removed a Marker',
                detail: 'A marker has been removed from the map',
                life: 3000
              });
              markerStore.patchRemove(value.message.data);
            }
          } else if (value.topic === 'cities') {
            messageService.add({
              severity: 'info',
              summary: 'New City',
              detail: `City "${value.message.data.title}" has been added`,
              life: 3000
            });
            cityStore.findAll();
          }
        })
      )
    );

    return {
      listenForEvents
    }
  })
)
