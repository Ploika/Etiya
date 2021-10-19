import {Action, Selector, State, StateContext} from "@ngxs/store";
import {COUNTRIES_DEFAULTS as defaults} from "../../constants/countriesDefaults";
import {UserService} from "../../services/user.service";
import {GetAllCountries} from "../actions/countries.actions";
import {Injectable} from "@angular/core";
import {tap} from "rxjs/operators";
import {CountriesStateModel} from "../../models/countriesStateModel";
import {ICountryResponse} from "../../models/countryResponse";

@State<CountriesStateModel>({
  name: 'countriesState',
  defaults
})
@Injectable()
export class CountriesState {

  constructor(private userService: UserService) {}

  @Selector()
  static getCountries({countries}: CountriesStateModel): ICountryResponse{
    return countries
  }

  @Action(GetAllCountries)
  getAllCountries({ patchState }: StateContext<CountriesStateModel>){
    return this.userService.getAllCountry()
      .pipe(
        tap(countries => {
           patchState({
             countries
          })
        })
      )
  }
}
