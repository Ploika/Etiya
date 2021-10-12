import {State, Action, StateContext, Selector} from "@ngxs/store";
import {UsersState} from "../../models/usersStateModel";
import {USERS_DEFAULTS as defaults}  from "../../constants/usersDefaults";
import {AddFullUser, AddOneUser, AddUsers, RemoveUsers} from "../actions/users.actions";

@State<UsersState>({
  name: 'usersState',
  defaults
})

export class  UserState{

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
  @Action(AddUsers)
  addUsers({ patchState } : StateContext<UsersState>, {payload}: AddUsers) {
    patchState({
      users: [...payload]
    })
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

}
