import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {IFullUser} from "../../models/fullUser";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ToastrService} from "ngx-toastr";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {UserState} from "../../store/states/users.state";
import {AddUsers} from "../../store/actions/users.actions";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
@UntilDestroy()
export class SearchComponent implements OnInit {
  userGroup: FormGroup;
  users: IFullUser[];
  searchUser: string = '';
  concatParams: string = '';

  @Select(UserState.getUsers) users$: Observable<IFullUser[]>

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private store: Store) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.userGroup = this.fb.group({
      firstName: [''],
      lastName: [''],
      userName: [''],
      email: [''],
      phone: ['']
    })
  }

  backToPreviousPage() {
    window.history.back();
  }

  clearFormGroup(): void {
   this.initFormGroup();
   this.searchUser = '';
   this.users = [];
   this.concatParams = '';
  }

  catchUser(event: boolean) {
    if(event){
      this.store.dispatch(new AddUsers());
      this.users$
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => this.users = [...users])

      this.initFormGroup();
      this.concatParams = '';
    }
  }

  dynamicRequest(): void {
    const userParams = this.userGroup.getRawValue();

    Object.keys(userParams).forEach(key => {
      if(userParams[key] !== ''){
        let  str = `${key}:${userParams[key]},`
        this.concatParams += str
      }
    })
    if(!this.concatParams){
      this.store.dispatch(new AddUsers());
      this.users$
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => this.users = [...users])
    } else  {
      this.store.dispatch(new AddUsers(this.concatParams));
      this.users$
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => this.users = [...users])
    }
  }
}
