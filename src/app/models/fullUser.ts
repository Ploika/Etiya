import {IUserAddress} from "./userAddress";

export interface IFullUser {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  phone: string,
  userName: string,
  userAddress: [IUserAddress]
}
