import { Component } from '@angular/core';
import { Regions } from '../../Interfaces/regions';
import { AvailabilityService } from '../../Services/availability.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Property } from '../../Interfaces/property';
import { RequestService } from '../../Services/request.service';
import { Location } from '@angular/common';
import $ from 'jquery';

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
  filteredPropertyList: Property[];
  openModal = false;
  formGroup: FormGroup;
  openModalRequested = false;
  max = 0;
  min = 0;

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
      next: (data) => {
        this.propertyList = data;
        this.filteredPropertyList = data;
        this.filterValues();
      },
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

  filterValues() {

    this.max = this.propertyList.reduce((prev, cur) =>
      cur.price > prev.price ? cur : prev
    ).price;

    this.min = this.propertyList.reduce((prev, cur) =>
      cur.price < prev.price ? cur : prev
    ).price;

    var lowerSlider: any = document.querySelector('#lower');
    var upperSlider: any = document.querySelector('#upper');
    var priceMax: any = document.querySelector('#price-max');
    var priceMin: any = document.querySelector('#price-min');
    // console.log(upperSlider)
    // upperSlider.value = this.max;
    // lowerSlider.value = this.min;
    // priceMax.value = upperSlider.value;
    // priceMin.value = lowerSlider.value;
    // console.log(this.max)
    var lowerVal = parseInt(lowerSlider.value);
    var upperVal = parseInt(upperSlider.value);

    upperSlider.oninput = function () {
      lowerVal = parseInt(lowerSlider.value);
      upperVal = parseInt(upperSlider.value);

      if (upperVal < lowerVal + 4) {
        lowerSlider.value = upperVal - 4;
        if (lowerVal == lowerSlider.min) {
          upperSlider.value = 4;
        }
      }
      priceMax.value = this.value
    };

    lowerSlider.oninput = function () {
      lowerVal = parseInt(lowerSlider.value);
      upperVal = parseInt(upperSlider.value);
      if (lowerVal > upperVal - 4) {
        upperSlider.value = lowerVal + 4;
        if (upperVal == upperSlider.max) {
          lowerSlider.value = parseInt(upperSlider.max) - 4;
        }
      }
      priceMin.value = this.value
    };
  }

  applyFilters() {
    var upper = document.getElementById('upper') as HTMLInputElement | null;
    var lower = document.getElementById('lower') as HTMLInputElement | null;
    const upperValue = upper?.value ?? '0';
    const lowerValue = lower?.value ?? '0';
    const rooms = document.getElementById('rooms') as HTMLInputElement | null;
    var roomsValue = parseFloat(rooms?.value ?? '0');
    const bathrooms = document.getElementById('bathrooms') as HTMLInputElement | null;
    var bathroomsValue = parseFloat(bathrooms?.value ?? '0');

    this.filteredPropertyList = this.propertyList.filter(x => x.price >= parseFloat(lowerValue) && x.price <= parseFloat(upperValue));

    if (bathroomsValue)
      this.filteredPropertyList = this.filteredPropertyList.filter(x => x.bathroomCount == bathroomsValue);
    else
      this.filteredPropertyList = this.filteredPropertyList;


    if (roomsValue)
      this.filteredPropertyList = this.filteredPropertyList.filter(x => x.roomCount == roomsValue);
    else
      this.filteredPropertyList = this.filteredPropertyList;
  }

}