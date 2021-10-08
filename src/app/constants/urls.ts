import {environment} from "../../environments/environment";

export const urls = {
  allUsers: `${environment.API}/api/user/all?pageSize=100`,
  userByEmail: `${environment.API}/api/user?email=`,
  login: `${environment.API}/authenticate`,
  createUser: `${environment.API}/api/user/new`,
  userByQueryParams: `${environment.API}/api/user/all?pageNum=0&sortBy=id&sortOrder=ASC&pageSize=100&search=`,
  updateUserById: `${environment.API}/api/user/`,
  allCountries: `https://countriesnow.space/api/v0.1/countries/positions`
}
