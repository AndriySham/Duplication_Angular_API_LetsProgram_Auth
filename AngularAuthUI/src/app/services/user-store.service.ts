import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");

  constructor() { }

  // getter
  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  // setter
  public setRoleForStore(role: string){
    this.role$.next(role);
  }

    // getter
    public getFullNameFromStore(){
      return this.fullName$.asObservable();
    }
  
    // setter
    public setFullNameForStore(fullName: string){
      this.fullName$.next(fullName);
    }
  // instal     npm i @auth0/angular-jwt    (decryte token)
}
