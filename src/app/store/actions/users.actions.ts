import {IUser} from "../../models/user";
import {IFullUser} from "../../models/fullUser";
import {ILoginUser} from "../../models/loginUser";

export  class AddUsers {
  static readonly type = '[USERS] Add'

  constructor( public payload?: string) {}
}
export  class AddOneUser {
  static readonly type = '[USERS] AddOne'

  constructor( public payload?: IUser ) {}
}
export class AddFullUser {
  static readonly type = '[USERS] AddFullUser'

  constructor( public payload: IFullUser ) {}
}
export class UpdateUserById {
  static  readonly type = '[USERS] UpdateUserById'

  constructor(public user: IFullUser, public token: string) {}
}
export class DeleteUserById {
  static readonly type = '[USERS] DeleteUserById'

  constructor(public id: number, public token: string) {}
}
export class GetUserByEmail {
  static readonly type = '[USERS] GetUserByEmail'

  constructor(public email: string, public token: string) {}
}
export class CreateUser {
  static readonly type = '[USERS] CreateUser'

  constructor(public payload: IFullUser) {}
}
export class LoginUser {
  static readonly type = '[USERS] LoginUser'

  constructor( public payload: ILoginUser) {}
}

