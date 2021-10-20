import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {ICountryResponse} from "../models/countryResponse";
import {Store} from "@ngxs/store";
import {GetAllCountries} from "../store/actions/countries.actions";

@Injectable({
  providedIn: 'root'
})
export class CountriesResolver implements Resolve<ICountryResponse> {
  constructor(private store: Store) {}
  resolve() {
    return this.store.dispatch(new GetAllCountries())
  }
}
