import {State, Action, StateContext, Selector} from "@ngxs/store";
import {UsersState} from "../../models/usersStateModel";
import {USERS_DEFAULTS as defaults}  from "../../constants/usersDefaults";
import {
  AddFullUser,
  AddOneUser,
  AddUsers,
  CreateUser, DeleteUserById, GetUserByEmail, LoginUser,
  RemoveUsers,
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
   static getUsers(state: UsersState){
    return state.users;
  }
  @Selector()
  static  getOneUser(state: UsersState){
    return state.user;
  }
  @Selector()
  static getFullUser(state: UsersState){
    return state.fullUser;
  }
  @Selector()
  static getUpdateUserResponse(state: UsersState){
    return state.updateUserResponse;
  }
  @Selector()
  static getLoginResponse(state: UsersState){
    return state.loginResponse;
  }
  @Action(AddUsers)
  addUsers({ patchState } : StateContext<UsersState>, {payload}: AddUsers) {
    if(payload){
       this.userService.getUserByQueryParams(payload)
        .pipe(
          untilDestroyed(this),
          tap(users => patchState({
            users: [...users]
          }) )
        )
        .subscribe()
    } else {
      this.userService.getAllUsers()
        .pipe(
          untilDestroyed(this),
          tap(users => patchState({
            users: [...users]
          }))
        )
        .subscribe()
    }
  }

  @Action(RemoveUsers)
  remove({getState, patchState}: StateContext<UsersState>, { payload }: RemoveUsers){
    patchState({
      users: getState().users.filter(a => a.firstName !== payload)
    })
  }

  @Action(AddOneUser)
  addOneUser({setState, patchState}: StateContext<UsersState>, { payload }: AddOneUser){
    if(payload){
      patchState({
        user: {...payload}
      })
    } else {
      setState(defaults)
    }
  }
  @Action(AddFullUser)
  addFullUser({patchState}: StateContext<UsersState>, { payload }: AddFullUser){
    patchState({
      fullUser: {...payload}
    })
  }
  @Action(GetUserByEmail)
  getUserByEmail(ctx: StateContext<UsersState>, { payload }: GetUserByEmail){
    return this.userService.getUserByEmail(payload.email, payload.token)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(user => {
        ctx.patchState({
          fullUser: {...user}
        })
      })
  }

  @Action(UpdateUserById)
  updateUserById({ patchState }: StateContext<UsersState>, { payload }: UpdateUserById){
    if(payload.user.id) {
      return  this.userService.updateUserById(payload.user, payload.user.id, payload.token)
        .pipe(
        tap({
          next: () => {},
          error: error => {
            patchState({
              updateUserResponse: {...error}
            })
          }
        })
      )
    } else {
      return of(null)
    }
  }
  @Action(DeleteUserById)
  deleteUserById(ctx: StateContext<UsersState>, { payload }: DeleteUserById){
    return this.userService.deleteUserById(payload.id, payload.token)
      .pipe(
        tap({
          next: () => {},
          error: error => {
            ctx.patchState({
              updateUserResponse: {...error}
            })
          }
        })
      )
  }
  @Action(CreateUser)
  createUser(ctx: StateContext<UsersState>, { payload }: CreateUser) {
    return this.authService.createUser(payload)
      .pipe(
        tap({
          next: () => {},
          error: error => {
            ctx.patchState({
              updateUserResponse: {...error}
            })
          }
        })
      )
  }

  @Action(LoginUser)
  loginUser(ctx: StateContext<UsersState>, { payload }: LoginUser){
    return this.authService.login(payload)
      .pipe(
        tap({
          next: (response) => {
            ctx.patchState({
              loginResponse: {...response}
            })
          },
          error: error => {
            ctx.patchState({
              updateUserResponse: {...error}
            })
          }
        })
      )
  }
}
