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
  @Input() userIndex: number;
  userDetailsGroup: FormGroup;
  userAddressGroup: FormGroup;
  userAddresses = new FormArray([]);
  indexEditingUserAddresses: number[] = [];
  checkIsFormGroupEmpty: boolean = false;

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
      email: [this.user.email, [Validators.required, Validators.email]],
      userAddress: this.userAddresses
    })

    this.user.userAddress.forEach((userAddress) => {
      this.userAddressGroup = this.fb.group({
        addressType: [userAddress.addressType, [Validators.required]],
        address: [userAddress.address, [Validators.required]],
        country: [userAddress.country, [Validators.required]],
        city: [userAddress.city, [Validators.required]],
        postalCode: [userAddress.postalCode, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
      })
      this.userAddresses.push(this.userAddressGroup);
    })

  }

  editUser(): void {
    this.editing = true;
    console.log(this.user.id);
  }

  get getFormControls(): any {
    return this.userDetailsGroup.controls
  }

  requestForUpdateUser(): void{
    const token = this.tokenService.getToken();

    if(token && this.user.id) {
      this.userService.updateUserById(this.user, this.user.id, token)
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(_ => {
          this.toastr.success('Success');
          this.lift.emit(true);
          this.editing = false;
        }, error => {
          if(error.status === 400) {
            this.toastr.error('Something went wrong')
          } else  if(error.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')){
            const errorMessage = error.error;
            this.toastr.error(errorMessage.substr(44));
          }
        })
    }
  }

  updateUser() {
    this.user = {...this.user, ...this.userDetailsGroup.value}
    this.requestForUpdateUser()
  }

  cancelEditing() {
    this.editing = false;
  }


  editUserAddress(i: number): void {
    this.indexEditingUserAddresses.push(i)
  }

  cancelUserAddressEditing(index: number): void {

    Object.keys(this.userAddresses.controls[index].value).forEach(value => {
      if(!this.userAddresses?.controls[index]?.value[value]) {
        this.userAddresses.controls.splice(index, 1);
      } else {
        this.userAddresses.controls[index].patchValue(this.user.userAddress[index]);
        this.indexEditingUserAddresses.splice(this.indexEditingUserAddresses[index], 1)
      }
    })
  }

  updateUserAddress(index: number): void {
    console.log(this.userDetailsGroup.value.userAddress[index]);
    this.user = {...this.user, ...this.userDetailsGroup.value}
    console.log(this.user)
    this.requestForUpdateUser()
  }

  deleteUserAddress(index: number): void {
    this.user.userAddress.splice(index, 1);

    this.requestForUpdateUser();
  }

  addAnotherAddress(): void {
    this.userAddressGroup = this.fb.group({
      addressType: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    })
    this.userAddresses.push(this.userAddressGroup);

    const lastElement = this.userAddresses.controls.slice(-1);

    Object.keys(lastElement[0].value).forEach(value => {
        if(lastElement[0].value[value] === '') {
          this.indexEditingUserAddresses.push(this.userAddresses.length - 1);
        }
    })
  }

  deleteUser(): void {
    console.log(this.user.id);
    const token = this.tokenService.getToken()
    if(this.user.id && token){
      // this.userService.deleteUserById(this.user.id, token)
      //   .pipe(
      //     untilDestroyed(this)
      //   )
      //   .subscribe(response => {
      //     console.log(response);
      //     this.lift.emit(true);
      //   }, error => console.log(error))
    }
  }
}
