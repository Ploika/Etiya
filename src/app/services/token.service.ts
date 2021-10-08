import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  helper = new JwtHelperService()
  constructor() { }

  decodeToken() {
    const token = localStorage.getItem('token');
    if(token) return this.helper.decodeToken(token);
  }
  getToken() {
    return localStorage.getItem('token')
  }
  setToken(token: string){
    localStorage.setItem('token', token)
  }
  removeToken(): void{
    localStorage.removeItem('token')
  }
}
