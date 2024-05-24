import { Component } from '@angular/core';
import { AvailabilityService } from '../../Services/availability.service';
import { Regions } from '../../Interfaces/regions';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent {

  searchType = 0;
  propertyType = 0;
  site = '';
  regions: Regions[] = [];
  filterRegions: Regions[] = [];

  constructor(
    private _availabilityService: AvailabilityService,
    private router: Router
  ) {
    this.getRegions();
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

    if(!filter){
      this.filterRegions = [];
      return;
    }

    this.filterRegions = this.regions.filter(x => x.departamento.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()) || x.municipio.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));
  }

  setRegion(municipio: string) {
    this.site = municipio;
    this.filterRegions = [];
  }

  getAvailability(){
    if (this.searchType == 0 || this.propertyType == 0 || this.site == '') {
      window.alert("Debes seleccionar opciones válidas");
      return;
    }

    this.router.navigate([`/availability/${this.searchType}/${this.propertyType}/${this.site}`]);
  }

}