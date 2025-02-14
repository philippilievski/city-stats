import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header/header.component';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  private readonly translate = inject(TranslateService);
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);

  constructor() {
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  showToast() {
    this.messageService.add({severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000});
  }

  changeLang() {
    this.translate.use('de');
  }
}
