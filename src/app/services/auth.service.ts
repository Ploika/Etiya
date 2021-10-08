import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ILoginUser} from "../models/loginUser";
import {IFullUser} from "../models/fullUser";
import {urls} from "../constants";
import {ICountryResponse} from "../models/countryResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: ILoginUser): Observable<ILoginUser>{
    return this.http.post<ILoginUser>(urls.login, user)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  createUser(user: IFullUser): Observable<IFullUser>{
    return this.http.post<IFullUser>(urls.createUser, user)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  getAllCountry(): Observable<ICountryResponse>{
    return this.http.get<ICountryResponse>(urls.allCountries)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }
}
