import {Component, computed, DestroyRef, effect, inject, signal} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {TranslateService, Translation} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {switchMap, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MarkerStore} from '../../marker/stores/marker.store';
import {CityStore} from '../../map/stores/city.store';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
    RouterLink,
    Button,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly markerStore = inject(MarkerStore);
  readonly cityStore = inject(CityStore);
  router = inject(Router);

  translations = signal<{ [key: string]: string }>({});
  menuItems = computed(() => {
    return [
      {
        label: this.translations()['home'],
        icon: 'pi pi-home',
        routerLink: '/home/map',
        testId: 'navigationmenu-home-button',
      },
      {
        label: this.translations()['statistics'],
        icon: 'pi pi-chart-pie',
        items: [
          {
            label: 'Population',
            icon: 'pi pi-users',
            routerLink: '/home/stats',
            testId: 'navigationmenu-stats-button',
          },
        ]
      },
      {
        label: '',
        icon: 'pi pi-language',
        command: () => {
          if (this.translate.currentLang === 'en') {
            this.translate.use('de')
          }
        }
      },
      {
        label: 'DEBUG',
        items: [
          {
            label: 'Remove all Markers',
            command: () => {
              this.markerStore.removeAll();
            }
          },
          {
            label: 'Remove all Cities',
            command: () => {
              this.cityStore.removeAll()
            }
          }
        ]
      }
    ];
  });

  constructor() {
    this.translate.onLangChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.translate.get(['app.home', 'app.statistics'])),
      tap((t: Translation) => {
        this.translations.set({
          "home": t["app.home"],
          "statistics": t["app.statistics"],
        });
      })
    ).subscribe();
  }
}
