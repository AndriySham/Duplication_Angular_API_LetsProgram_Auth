import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://localhost:7184/api/User/';
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
    console.log(`constructor${this.userPayload }`);
   }

  signUp(userObj: any){
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(userObj: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, userObj);
  }

  singOut(){
    localStorage.clear();
    //localStorage.removeItem('token');
    this.router.navigate(['login']);
  }



  //#region For implement guard 

  storeToken(tokenValue: string){             // set token
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string){             // 9 video Refresh Token
    localStorage.setItem('refreshToken', tokenValue);
  }

   
  getToken(){                                 // get token
    return localStorage.getItem('token');
  }

  getRefreshToken(){                                 // 9 video Refresh Token
    return localStorage.getItem('refreshToken');
  }


  isLoggedIn():boolean{ // check, if user login - it return TRUE, else - it return null (false)
    return !!localStorage.getItem('token'); // !!- convert from string to bool
  }
  //#endregion

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  // Refresh Token
  renewToken(tokenApi: TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
  }
}
