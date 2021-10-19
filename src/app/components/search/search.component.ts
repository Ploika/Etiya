import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {IFullUser} from "../../models/fullUser";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngxs/store";
import {UserState} from "../../store/states/users.state";
import {AddUsers} from "../../store/actions/users.actions";
import {switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  userGroup: FormGroup;
  users: IFullUser[];
  searchUser: string = '';
  concatParams: string = '';

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
      this.store.dispatch(new AddUsers())
        .pipe(
          take(1),
          switchMap(() => this.store.selectOnce(UserState.getUsers))
        )
        .subscribe(users => this.users = users)

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
      this.store.dispatch(new AddUsers())
        .pipe(
          take(1),
          switchMap(() => this.store.selectOnce(UserState.getUsers))
        )
        .subscribe(users => this.users = users)
    } else  {
      this.store.dispatch(new AddUsers(this.concatParams))
        .pipe(
          take(1),
          switchMap(() => this.store.selectOnce(UserState.getUsers))
        )
        .subscribe(users => this.users = users)
    }
  }
}
