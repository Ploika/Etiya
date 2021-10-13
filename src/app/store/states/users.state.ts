import {State, Action, StateContext, Selector} from "@ngxs/store";
import {UsersState} from "../../models/usersStateModel";
import {USERS_DEFAULTS as defaults}  from "../../constants/usersDefaults";
import {AddFullUser, AddOneUser, AddUsers, CreateUser, RemoveUsers, UpdateUserById} from "../actions/users.actions";
import {UserService} from "../../services/user.service";
import {tap} from "rxjs/operators";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


@State<UsersState>({
  name: 'usersState',
  defaults
})
@Injectable()
@UntilDestroy()

export class UserState {

  constructor(private userService: UserService,
              private toastr: ToastrService,
              private authService: AuthService,
              private router: Router) {
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
    return state.updateUserResponse
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
        .subscribe(_ => {})
    } else {
      this.userService.getAllUsers()
        .pipe(
          untilDestroyed(this),
          tap(users => patchState({
            users: [...users]
          }))
        )
        .subscribe(_ => {})
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

  @Action(UpdateUserById)
  updateUserById({ patchState }: StateContext<UsersState>, { payload }: UpdateUserById){
    if(payload.user.id) {
      this.userService.updateUserById(payload.user, payload.user.id, payload.token).pipe(
        tap({
          next: res => {
            patchState({
              updateUserResponse: {...res}
            })
          },
          error: error => {
            patchState({
              updateUserResponse: {...error}
            })
          }
        })
      ).subscribe()
      // this.userService.updateUserById(payload.user, payload.user.id, payload.token)
      //   // .pipe(
      //   //   untilDestroyed(this),
      //   // )
      //   .subscribe({
      //     next: (response) => {
      //       patchState({
      //         updateUserResponse: {...response}
      //       })
      //     },
      //     error: (error) => {
      //       patchState({
      //         updateUserResponse: {...error}
      //       })
      //       // if(error.status === 400 && error.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')) {
      //       //   const errorMessage = error.error;
      //       //   this.toastr.error(errorMessage.substr(44));
      //       // } else  if(error.status === 401){
      //       //   this.toastr.error('Unauthorized');
      //       // } else  if(error.status === 400){
      //       //   this.toastr.error('Please fill valid data')
      //       // }
      //     }
      //   })
    }
  }
  @Action(CreateUser)
  createUser(stateStateContext: StateContext<UsersState>, { payload }: CreateUser) {
    this.authService.createUser(payload)
  }
}
