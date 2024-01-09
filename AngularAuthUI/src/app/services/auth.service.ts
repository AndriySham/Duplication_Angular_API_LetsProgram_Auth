import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://localhost:7184/api/User/'

  constructor(private http: HttpClient) { }

  signUp(userObj: any){
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(userObj: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, userObj);
  }



  //#region For implement guard 

  storeToken(tokenValue: string){             // set token
    localStorage.setItem('token', tokenValue);
  }
   
  getToken(){                                 // get token
    return localStorage.getItem('token');
  }

  isLoggedIn():boolean{ // check, if user login - it return TRUE, else - it return null (false)
    return !!localStorage.getItem('token'); // !!- convert from string to bool
  }
  //#endregion
}
