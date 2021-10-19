import {State, Action, StateContext, Selector} from "@ngxs/store";
import {UsersState} from "../../models/usersStateModel";
import {USERS_DEFAULTS as defaults}  from "../../constants/usersDefaults";
import {
  AddFullUser,
  AddOneUser,
  AddUsers,
  CreateUser, DeleteUserById, GetUserByEmail, LoginUser,
  UpdateUserById
} from "../actions/users.actions";
import {UserService} from "../../services/user.service";
import {tap} from "rxjs/operators";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";


@State<UsersState>({
  name: 'usersState',
  defaults
})
@Injectable()
@UntilDestroy()

export class UserState {

  constructor(private userService: UserService,
              private toastr: ToastrService,
              private authService: AuthService) {
  }

  @Selector()
   static getUsers({ users }: UsersState){
    return users;
  }
  @Selector()
  static  getOneUser({ user }: UsersState){
    return user;
  }
  @Selector()
  static getFullUser({ fullUser }: UsersState){
    return fullUser;
  }
  @Selector()
  static getUpdateUserResponse({ updateUserResponse }: UsersState){
    return updateUserResponse;
  }
  @Selector()
  static getLoginResponse({ loginResponse }: UsersState){
    return loginResponse;
  }
  @Action(AddUsers)
  addUsers({ patchState } : StateContext<UsersState>, { payload }: AddUsers) {
    if(payload){
      return this.userService.getUserByQueryParams(payload)
        .pipe(
          untilDestroyed(this),
          tap(users => patchState({
            users
          }))
        );
    } else {
      return this.userService.getAllUsers()
        .pipe(
          untilDestroyed(this),
          tap(users => patchState({
            users
          }))
        );
    }
  }

  @Action(AddOneUser)
  addOneUser({setState, patchState}: StateContext<UsersState>, { payload }: AddOneUser){
    if(payload){
      patchState({
        user: payload
      })
    } else {
      setState(defaults)
    }
  }
  @Action(AddFullUser)
  addFullUser({patchState}: StateContext<UsersState>, { payload }: AddFullUser){
    patchState({
      fullUser: payload
    })
  }
  @Action(GetUserByEmail)
  getUserByEmail({ patchState }: StateContext<UsersState>, { email, token }: GetUserByEmail){
    return this.userService.getUserByEmail(email, token)
      .pipe(
        untilDestroyed(this),
        tap(user => {
        patchState({
          fullUser: user
        })
      })
      )
  }

  @Action(UpdateUserById)
  updateUserById({ patchState }: StateContext<UsersState>, { user, token }: UpdateUserById){
    if(user.id) {
      return  this.userService.updateUserById( user, user.id, token)
        .pipe(
        tap({
          next: () => {},
          error: error => {
            patchState({
              updateUserResponse: error
            })
          }
        })
      )
    } else {
      return of(null)
    }
  }
  @Action(DeleteUserById)
  deleteUserById({ patchState }: StateContext<UsersState>, { id, token }: DeleteUserById){
    return this.userService.deleteUserById(id, token)
      .pipe(
        tap({
          next: () => {},
          error: error => {
            patchState({
              updateUserResponse: error
            })
          }
        })
      )
  }
  @Action(CreateUser)
  createUser({ patchState }: StateContext<UsersState>, { payload }: CreateUser) {
    return this.authService.createUser(payload)
      .pipe(
        tap({
          next: () => {},
          error: error => {
            patchState({
              updateUserResponse: error
            })
          }
        })
      )
  }

  @Action(LoginUser)
  loginUser({ patchState }: StateContext<UsersState>, { payload }: LoginUser){
    return this.authService.login(payload)
      .pipe(
        tap({
          next: (response) => {
            patchState({
              loginResponse: response
            })
          },
          error: error => {
            patchState({
              updateUserResponse: error
            })
          }
        })
      )
  }
}
