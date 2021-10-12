import {UsersState} from "../models/usersStateModel";
import {IUser} from "../models/user";
import { IFullUser } from "../models/fullUser";


export const USERS_DEFAULTS: UsersState = {
  users: [],
  user: {} as IUser,
  userAddress: [],
  fullUser: {} as IFullUser
}
