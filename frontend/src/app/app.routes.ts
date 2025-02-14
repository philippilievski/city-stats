import {Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {StatsComponent} from './views/stats/stats.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  }
];
