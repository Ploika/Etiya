import {IFullUser} from "./fullUser";
import {IUserAddress} from "./userAddress";
import {IUser} from "./user";
import {IErrorResponse} from "./errorResponse";
import {ILoginResponse} from "./loginResponse";

export  interface UsersState {
  users: IFullUser[],
  user: IUser,
  userAddress: IUserAddress[],
  fullUser: IFullUser,
  updateUserResponse?: IErrorResponse,
  loginResponse: ILoginResponse
}
