import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Request } from '../Interfaces/request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private fireStore: Firestore
  ) { }

  addRequest(request: Request) {
    const requestRef = collection(this.fireStore, 'request');
    return addDoc(requestRef, request);
  }

  getRequestList(): Observable<Request[]> {
    const requestRef = collection(this.fireStore, 'request');
    return collectionData(requestRef, { idField: 'id' }) as Observable<Request[]>;
  }
}