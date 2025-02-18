import {Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {StatsComponent} from './views/stats/stats.component';
import {MapComponent} from './map/map/map.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/map',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'map',
        component: MapComponent
      },
      {
        path: 'stats',
        component: StatsComponent
      }
    ]
  },
];
