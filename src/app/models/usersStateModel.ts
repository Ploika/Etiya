import {IFullUser} from "./fullUser";
import {IUserAddress} from "./userAddress";
import {IUser} from "./user";
import {IErrorResponse} from "./errorResponse";

export  interface UsersState {
  users: IFullUser[],
  user: IUser,
  userAddress: IUserAddress[],
  fullUser: IFullUser,
  updateUserResponse?: IFullUser | IErrorResponse
}
