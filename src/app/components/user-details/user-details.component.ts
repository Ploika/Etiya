import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFullUser} from "../../models/fullUser";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenService} from "../../services/token.service";
import {UserService} from "../../services/user.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../dialog-delete/dialog-delete.component";
import {ICountries} from "../../models/countries";

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
  countries: ICountries[];

  @Output()
  lift = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
              private tokenService: TokenService,
              private userService: UserService,
              private toastr: ToastrService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userDetailsGroup = this.fb.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2), Validators.pattern]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2), Validators.pattern]],
      userName: [this.user.userName, [Validators.required]],
      phone: [this.user.phone, [Validators.required, Validators.pattern]],
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

    this.userService.getAllCountry()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(countries => this.countries = countries.data)
  }

  get getFormControls() { // make 1 function
    return this.userDetailsGroup.controls
  }
  get getAddressFormControls(): any{ //make 1 function
    return this.userAddresses.controls
  }

  editUser(): void {
    this.editing = true;
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
            this.toastr.error('Please fill valid data')
          } else  if(error.status === 401){
            this.toastr.error('Unauthorized');
          } else  if(error.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')){
            const errorMessage = error.error;
            this.toastr.error(errorMessage.substr(44));
          }
        })
    }
  }

  updateUser() {
    this.user = {...this.user, ...this.userDetailsGroup.value};
    this.requestForUpdateUser();
  }

  cancelEditing() {
    this.editing = false;
  }

  deleteUser(): void {
    const token = this.tokenService.getToken();
    let dialogRef = this.dialog.open(DialogDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(+result && this.user.id && token){
        this.userService.deleteUserById(this.user.id, token)
          .pipe(
            untilDestroyed(this)
          )
          .subscribe(response => {
            this.toastr.success('Deleted');
            this.lift.emit(true);
          }, error => this.toastr.error('Something went wrong'))
      }
    })
  }


  editUserAddress(i: number): void {
    this.indexEditingUserAddresses = [...this.indexEditingUserAddresses, i];
  }

  cancelUserAddressEditing(index: number): void {

    const positionIndex = this.indexEditingUserAddresses.indexOf(index);
    let confirmArray: number[] = []

    Object.keys(this.userAddresses.controls[index].value).find(value => {
      if(this.userAddresses?.controls[index]?.value[value] === '') {
        confirmArray = [...confirmArray, 1];
      }
    })
    if(confirmArray.length === 5){
      this.userAddresses.controls.splice(index, 1);
      this.indexEditingUserAddresses.splice(positionIndex, 1);
    } else {
      this.indexEditingUserAddresses.splice(positionIndex, 1);
      this.userAddresses.controls[index].patchValue(this.user.userAddress[index]);
    }

  }

  updateUserAddress(index: number): void {
    this.user.userAddress.map((value) => {
      return {...value, postalCode: +value.postalCode}
    })
    this.user = {...this.user, ...this.userDetailsGroup.value}
    this.requestForUpdateUser()
  }

  deleteUserAddress(index: number): void {
    let dialogRef = this.dialog.open(DialogDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'true') {
        this.user.userAddress.splice(index, 1);
        this.requestForUpdateUser();
      }
    })
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
    this.indexEditingUserAddresses.push(this.userAddresses.length - 1);
  }
}
