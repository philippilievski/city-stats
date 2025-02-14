import {ChangeDetectorRef, Component, computed, inject, OnInit, PLATFORM_ID, ProviderToken} from '@angular/core';
import {ChartModule, UIChart} from 'primeng/chart';
import {isPlatformBrowser} from '@angular/common';
import {CityService} from '../../city/services/city.service';
import {CityStore} from '../../map/stores/city.store';
import {generateRandomRgba, generateRandomRgbaArray} from '../../utils/randomRGBA';

@Component({
  selector: 'app-stats',
  imports: [
    ChartModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  providers: [CityStore]
})
export class StatsComponent implements OnInit {
  cityStore = inject(CityStore);
  basicOptions: any;
  platformId = inject(PLATFORM_ID);

  basicData = computed((() => {
    if(this.cityStore.cities()) {
      const randomRgbaArray = generateRandomRgbaArray(this.cityStore.cities().length);
      return {
        labels: [...this.cityStore.cities().map((city) => city.title)],
        datasets: [
          {
            label: 'Cities',
            data: [...this.cityStore.cities().map((city) => city.population)],
            backgroundColor: [...randomRgbaArray],
            borderColor: [...randomRgbaArray],
            borderWidth: 1,
          }
        ]
      }
    }
    else {
      return [];
    }
  }))

  ngOnInit() {
    this.cityStore.findAll();
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }
}
