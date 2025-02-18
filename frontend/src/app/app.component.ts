import {AfterContentInit, Component, effect, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header/header.component';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {MarkerStore} from './marker/stores/marker.store';
import {EventStore} from './event/event.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, EventStore]
})
export class AppComponent implements AfterContentInit {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngAfterContentInit(): void {

  }
}
