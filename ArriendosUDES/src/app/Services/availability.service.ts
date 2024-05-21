import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Regions } from '../Interfaces/regions';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(
    private http: HttpClient
  ) { }

  getRegions(): Observable<Regions[]> {
    return this.http.get<Regions[]>("https://www.datos.gov.co/resource/xdk5-pm3f.json");
  }
}