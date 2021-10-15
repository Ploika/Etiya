import {Action, Selector, State, StateContext} from "@ngxs/store";
import {COUNTRIES_DEFAULTS as defaults} from "../../constants/countriesDefaults";
import {UserService} from "../../services/user.service";
import {GetAllCountries} from "../actions/countries.actions";
import {Injectable} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {tap} from "rxjs/operators";
import {CountriesStateModel} from "../../models/countriesStateModel";

@State<CountriesStateModel>({
  name: 'countriesState',
  defaults
})
@Injectable()
@UntilDestroy()
export class CountriesState {

  constructor(private userService: UserService) {}

  @Selector()
  static getCountries(state: CountriesStateModel){
    return state.countries
  }

  @Action(GetAllCountries)
  getAllCountries(ctx: StateContext<CountriesStateModel>){
    this.userService.getAllCountry()
      .pipe(
        untilDestroyed(this),
        tap(countries => {
           ctx.patchState({
            countries: {...countries}
          })
        })
      )
      .subscribe()
  }
}
