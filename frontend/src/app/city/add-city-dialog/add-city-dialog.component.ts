import {Component, inject, input, model, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CityPayload} from '../../data/city';
import {InputNumber} from 'primeng/inputnumber';
import {MarkerStore} from '../../map/stores/marker.store';
import {MarkerMetadata} from '../../data/marker-metadata';

@Component({
  selector: 'app-add-city-dialog',
  imports: [
    Dialog,
    InputText,
    Button,
    ReactiveFormsModule,
    InputNumber
  ],
  templateUrl: './add-city-dialog.component.html',
  styleUrl: './add-city-dialog.component.scss'
})
export class AddCityDialogComponent {
  formBuilder = new FormBuilder();
  markerStore = inject(MarkerStore);

  visible = model<boolean>(false);
  markerMetadata = input<MarkerMetadata>();
  visibleChanged = output<boolean>();
  cityToSave = output<CityPayload>();

  addCityForm = this.formBuilder.group({
    title: ['', Validators.required],
    population: [0, Validators.required]
  });

  onVisibleChanged(visible: boolean) {
    this.visibleChanged.emit(visible);
  }

  onSaveCity() {
    const { title, population } = this.addCityForm.value;
    if(title && population) {
      this.cityToSave.emit({
        city: {title, population},
        connectToMarker: this.markerMetadata()
      });
      this.addCityForm.reset();
      this.visibleChanged.emit(false);
    }
  }
}
