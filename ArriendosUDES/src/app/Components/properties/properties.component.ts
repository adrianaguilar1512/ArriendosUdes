import { Component } from '@angular/core';
import { AvailabilityService } from '../../Services/availability.service';
import { Property } from '../../Interfaces/property';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Regions } from '../../Interfaces/regions';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {

  propertyList: Property[] = [];
  formGroup: FormGroup;
  openModal = false;
  regions: Regions[] = [];
  filterRegions: Regions[] = [];

  constructor(
    private _propertiesService: AvailabilityService,
    private formBuilder: FormBuilder
  ) {
    this.getRegions();
    this.getAllProperties();
    this.setFormGroup();
  }

  setFormGroup() {
    this.formGroup = this.formBuilder.group({
      bathroomCount: ['', Validators.required],
      city: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      propertyType: ['', Validators.required],
      roomCount: ['', Validators.required],
      searchType: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  getRegions() {
    this._propertiesService.getRegions().subscribe({
      next: (data) => this.regions = data,
      error: () => window.alert("Ha ocurrido un error, intentalo de nuevo")
    });
  }

  setFilterRegions() {
    this.filterRegions = [];
    var input = document.getElementById('region') as HTMLInputElement | null;
    const filter = input?.value;

    if (!filter) {
      this.filterRegions = [];
      return;
    }

    this.filterRegions = this.regions.filter(x => x.departamento.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()) || x.municipio.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));
  }

  setRegion(item: Regions) {
    this.formGroup.controls['city'].setValue(item.municipio);
    this.formGroup.controls['state'].setValue(item.departamento);
    this.filterRegions = [];
  }

  getAllProperties() {
    this._propertiesService.getAllProperties().subscribe({
      next: (data) => this.propertyList = data,
      error: (ex) => window.alert(ex.message)
    });
  }

  async delete(property: Property) {
    await this._propertiesService.delete(property);
  }

  async add() {
    await this._propertiesService.addProperty(this.formGroup.value);
    this.setFormGroup();
    this.openModal = false;
  }

}