import { Component } from '@angular/core';
import {MapComponent} from '../../map/map/map.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
