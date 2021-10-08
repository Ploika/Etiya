import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {IFullUser} from "../models/fullUser";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {urls} from "../constants";

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
  deleteUserById(userId: number, token: string): Observable<HttpResponse<Object>>{
    return this.http.delete<Object>(`${urls.deleteUserById}${userId}`, {
      observe: 'response',
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    })
      .pipe(
        catchError(this.errorHandler)
      )
  }
  errorHandler(error: HttpErrorResponse){
    return throwError(error);
  }
}
