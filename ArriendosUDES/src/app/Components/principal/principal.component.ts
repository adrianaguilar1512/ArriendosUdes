import { Component } from '@angular/core';
import { AvailabilityService } from '../../Services/availability.service';
import { Regions } from '../../Interfaces/regions';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent {

  searchType = 0;
  propertyType = 0;
  site = '';
  regions: Regions[] = [];

  constructor(
    private _availabilityService: AvailabilityService
  ) {
    this.getRegions();
  }

  getRegions() {
    this._availabilityService.getRegions().subscribe({
      next: (data) => this.regions = data,
      error: (ex) => window.alert("Ha ocurrido un error, intentalo de nuevo")
    });
  }

}