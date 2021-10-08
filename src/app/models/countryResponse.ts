import {ICountries} from "./countries";

export interface ICountryResponse {
  error: boolean,
  msg: string,
  data: ICountries[]
}
