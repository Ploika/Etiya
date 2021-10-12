import {IUser} from "../../models/user";
import {IFullUser} from "../../models/fullUser";

export  class AddUsers {
  static readonly type = '[USERS] Add'

  constructor( public payload: IFullUser[]) {}
}

export  class RemoveUsers {
  static readonly type = '[USERS] Remove'

  constructor( public payload: string ) {}
}

export  class AddOneUser {
  static readonly type = '[USERS] AddOne'

  constructor( public payload?: IUser ) {}
}
export class AddFullUser {
  static readonly type = '[USERS] AddFullUser'

  constructor( public payload: IFullUser ) {}
}
