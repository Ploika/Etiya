import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {IFullUser} from "../../models/fullUser";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ToastrService} from "ngx-toastr";

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
  concatParams: string = ''

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  backToPreviousPage() {
    window.history.back();
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

  clearFormGroup(): void {
   this.initFormGroup();
   this.searchUser = '';
   this.users = [];
    this.concatParams = '';
  }

  getUserByQueryParams(): void {
    const userParams = this.userGroup.getRawValue();

    Object.keys(userParams).forEach(key => {
      if(userParams[key] !== ''){
        let  str = `${key}:${userParams[key]},`
        this.concatParams += str
      }
    })

    this.dynamicRequest();
  }

  catchUser(event: boolean) {
    if(event){
      this.userService.getAllUsers()
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => {
          this.users = users
        }, error => this.toastr.error('Something went wrong'))

      this.initFormGroup()
      this.concatParams = '';
    }
  }

  dynamicRequest(): void {
    if(this.concatParams === ''){
      this.userService.getAllUsers()
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => {
          this.users = users;
        }, error => this.toastr.error('Something went wrong'))
    } else {
      this.userService.getUserByQueryParams(this.concatParams)
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(users => {
          this.users = users;
        }, error => this.toastr.error('Something went wrong'))
    }
  }
}
