import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { User } from '../Interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private fireStore: Firestore
  ) { }

  login(phone: string, password: string): Observable<User[]> {
    const userRef = collection(this.fireStore, 'user');
    const queryRef = query(userRef, where('phone', '==', phone), where('password', '==', password))
    return collectionData(queryRef, {idField: 'id'}) as Observable<User[]>;
  }
}