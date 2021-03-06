import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {IFullUser} from "../models/fullUser";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {urls} from "../constants";
import {ICountryResponse} from "../models/countryResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<IFullUser[]>{
    return this.http.get<IFullUser[]>(urls.allUsers)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  getUserByEmail(email: string, token: string): Observable<IFullUser>{
    return this.http.get<IFullUser>(`${urls.userByEmail}${email}`, {
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    })
      .pipe(
        catchError(this.errorHandler)
      )
  }
  getUserByQueryParams(params: string): Observable<IFullUser[]>{
    return this.http.get<IFullUser[]>(`${urls.userByQueryParams}${params}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  updateUserById(user: IFullUser, userId: number, token: string): Observable<IFullUser>{
    return this.http.put<IFullUser>(`${urls.updateUserById}${userId}`, user, {
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    })
      .pipe(
        catchError(this.errorHandler)
      )
  }
  deleteUserById(userId: number, token: string): Observable<null>{
    return this.http.delete<null>(`${urls.deleteUserById}${userId}`, {
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    })
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
    return throwError(error);
  }
}
