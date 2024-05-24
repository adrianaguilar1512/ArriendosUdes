import { Component } from '@angular/core';
import { Regions } from '../../Interfaces/regions';
import { AvailabilityService } from '../../Services/availability.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Property } from '../../Interfaces/property';
import { RequestService } from '../../Services/request.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss'
})
export class AvailabilityComponent {

  searchType = 0;
  propertyType = 0;
  site = '';
  regions: Regions[] = [];
  filterRegions: Regions[] = [];
  propertyList: Property[];
  openModal = false;
  formGroup: FormGroup;
  openModalRequested = false;

  constructor(
    private _availabilityService: AvailabilityService,
    private _activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _requestService: RequestService,
    private location: Location
  ) {
    this.setFormRequest();
    this.getRegions();
    this.setData();
    this.getPropertyList();
  }

  getRegions() {
    this._availabilityService.getRegions().subscribe({
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

  setRegion(municipio: string) {
    this.site = municipio;
    this.filterRegions = [];
  }

  setData() {
    this._activatedRouter.params.subscribe({
      next: (data) => {
        this.searchType = data['searchType'];
        this.propertyType = data['propertyType'];
        this.site = data['site'];
      }
    })
  }

  getAvailability() {
    if (this.searchType == 0 || this.propertyType == 0 || this.site == '') {
      window.alert("Debes seleccionar opciones válidas");
      return;
    }

    this.location.replaceState(`/availability/${this.searchType}/${this.propertyType}/${this.site}`);
    this.getPropertyList();
  }

  getPropertyList() {
    this._availabilityService.getProperties(this.searchType, this.propertyType, this.site).subscribe({
      next: (data) => this.propertyList = data,
      error: (ex) => window.alert(ex.message)
    });
  }

  setFormRequest() {
    this.formGroup = this.formBuilder.group({
      idProperty: ['', Validators.required],
      applicantEmail: ['', Validators.required],
      applicantPhone: ['', Validators.required],
    });
  }

  request(id?: string) {
    this.formGroup.controls['idProperty'].setValue(id);
    this.openModal = true;
  }

  async addRequest() {
    await this._requestService.addRequest(this.formGroup.value);
    this.setFormRequest();
    this.openModal = false;
    this.openModalRequested = true;
  }

}