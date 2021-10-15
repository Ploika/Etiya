import {UsersState} from "../models/usersStateModel";
import {IUser} from "../models/user";
import { IFullUser } from "../models/fullUser";
import {IErrorResponse} from "../models/errorResponse";
import {ILoginResponse} from "../models/loginResponse";


export const USERS_DEFAULTS: UsersState = {
  users: [],
  user: {} as IUser,
  userAddress: [],
  fullUser: {} as IFullUser,
  updateUserResponse: {} as IErrorResponse,
  loginResponse: {} as ILoginResponse
}
