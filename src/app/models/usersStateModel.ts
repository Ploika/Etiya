import {IFullUser} from "./fullUser";
import {IUserAddress} from "./userAddress";
import {IUser} from "./user";

export  interface UsersState {
  users: IFullUser[],
  user: IUser,
  userAddress: IUserAddress[],
  fullUser: IFullUser
}
