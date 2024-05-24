import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Regions } from '../Interfaces/regions';
import { HttpClient } from '@angular/common/http';
import { Property } from '../Interfaces/property';
import { Firestore, collection, collectionData, addDoc, query, where, doc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(
    private http: HttpClient,
    private fireStore: Firestore
  ) { }

  getRegions(): Observable<Regions[]> {
    return this.http.get<Regions[]>("https://www.datos.gov.co/resource/xdk5-pm3f.json");
  }

  addProperty(property: Property) {
    const propertyRef = collection(this.fireStore, 'property');
    return addDoc(propertyRef, property);
  }

  getAllProperties(): Observable<Property[]> {
    const propertyRef = collection(this.fireStore, 'property');
    return collectionData(propertyRef, { idField: 'id' }) as Observable<Property[]>;
  }

  getProperties(searchType: number, propertyType: number, site: string): Observable<Property[]> {
    const propertyRef = collection(this.fireStore, 'property');
    const queryRef = query(propertyRef, where('searchType', '==', parseInt(searchType.toString())), where('propertyType', '==', parseInt(propertyType.toString())), where('city', '==', site));
    return collectionData(queryRef, { idField: 'id' }) as Observable<Property[]>;
  }

  delete(property: Property) {
    const propertyRef = doc(this.fireStore, `property/${property.id}`);
    return deleteDoc(propertyRef);
  }
}