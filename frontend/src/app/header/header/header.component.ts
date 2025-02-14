import {Component, computed, inject, signal} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {TranslateService} from '@ngx-translate/core';
import {TranslationStore} from '../../map/stores/translation.store';
import {Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
    RouterLink,
    Button,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [TranslationStore]
})
export class HeaderComponent {
  private readonly translate = inject(TranslateService);
  translationStore = inject(TranslationStore);
  router = inject(Router);

  translations = signal<{ [key: string]: string }>({});
  menuItems = computed(() => {
    return [
      {
        label: this.translations()['home'] ?? 'Home',
        icon: 'pi pi-home',
        routerLink: '/home',
        testId: 'navigationmenu-home-button',
      },
      {
        label: this.translations()['statistics'] ?? 'Statistics',
        icon: 'pi pi-chart-pie',
        items: [
          {
            label: 'Population',
            icon: 'pi pi-users',
            routerLink: '/stats',
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
          } else {
            this.translate.use('en')
          }
        }
      }
    ];
  });

  constructor() {
    this.translationStore.getHeaderTranslations();
  }
}
