import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFullUser} from "../../models/fullUser";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenService} from "../../services/token.service";
import {UserService} from "../../services/user.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
@UntilDestroy()
export class UserDetailsComponent implements OnInit {
  editing: boolean = false;

  @Input() user: IFullUser;
  @Input() userIndex: number
  userDetailsGroup: FormGroup;
  userAddressGroup: FormGroup;
  myArrayGroup: FormGroup;
  userAddresses = new FormArray([]);
  userAddressEditing: boolean = false;
  indexEditingUserAddresses: number[] = []
  @Output()
  lift = new EventEmitter()

  constructor(private fb: FormBuilder,
              private tokenService: TokenService,
              private userService: UserService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userDetailsGroup = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      userName: [this.user.userName, [Validators.required]],
      phone: [this.user.phone, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]]
    })
    this.user.userAddress.forEach((userAddress) => {
      this.userAddressGroup = this.fb.group({
        addressType: [userAddress.addressType, [Validators.required]],
        address: [userAddress.address, [Validators.required]],
        country: [userAddress.country, [Validators.required]],
        city: [userAddress.city, [Validators.required]],
        postalCode: [userAddress.postalCode, [Validators.required]]
      })
      this.userAddresses.push(this.userAddressGroup);
    })
    this.myArrayGroup = new FormGroup({
      userAddresses: this.userAddresses
    })
  }

  editUser(): void {
    this.editing = true;
  }


  get getFormControls(): any {
    return this.userDetailsGroup.controls
  }

  updateUser() {

    this.user.firstName = this.userDetailsGroup.controls.firstName.value;
    this.user.lastName = this.userDetailsGroup.controls.lastName.value;
    this.user.userName = this.userDetailsGroup.controls.userName.value;
    this.user.phone = this.userDetailsGroup.controls.phone.value;
    this.user.email = this.userDetailsGroup.controls.email.value;

    const token = this.tokenService.getToken();

    if(token && this.user.id) {
      this.userService.updateUserById(this.user, this.user.id, token)
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(_ => {
          this.toastr.success('Updated');
          this.lift.emit(true);
          this.editing = false;
        }, error => {

          if(error.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')) {
            const errorMessage = error.error
            this.toastr.error(errorMessage.substr(44))
          } else {
            this.toastr.error('Something went wrong')
          }
        })
    }

  }

  cancelEditing() {
    this.editing = false;
  }


  editUserAddress(i: number): void {
    console.log(i)
    this.indexEditingUserAddresses.push(i)
  }

  cancelUserAddressEditing(): void {

  }
}
