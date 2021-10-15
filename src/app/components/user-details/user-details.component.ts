import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFullUser} from "../../models/fullUser";
import { FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenService} from "../../services/token.service";
import {UserService} from "../../services/user.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../dialog-delete/dialog-delete.component";
import {ICountries} from "../../models/countries";
import {Actions, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {DeleteUserById, UpdateUserById} from "../../store/actions/users.actions";
import {Observable} from "rxjs";
import { UserState } from 'src/app/store/states/users.state';
import {CountriesState} from "../../store/states/countries.state";
import {ICountryResponse} from "../../models/countryResponse";
import {GetAllCountries} from "../../store/actions/countries.actions";


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
  @Select(CountriesState.getCountries) countries$: Observable<ICountryResponse>;

  constructor(private fb: FormBuilder,
              private tokenService: TokenService,
              private userService: UserService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private store: Store,
              private actions$: Actions) { }

  ngOnInit(): void {
   this.initUserDetailsGroup()

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
    this.store.dispatch(new GetAllCountries())
    this.countries$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(countries => this.countries = countries.data)
  }

  initUserDetailsGroup(): void {
    this.userDetailsGroup = this.fb.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2), Validators.pattern]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2), Validators.pattern]],
      userName: [this.user.userName, [Validators.required]],
      phone: [this.user.phone, [Validators.required, Validators.pattern]],
      email: [this.user.email, [Validators.required, Validators.email]],
      userAddress: this.userAddresses
    })
  }

  get getFormControls() {
    return this.userDetailsGroup.controls
  }
  get getAddressFormControls(): any {
    return this.userAddresses.controls
  }

  editUser(): void {
    this.editing = true;
  }

  requestForUpdateUser(): void{
    const token = this.tokenService.getToken();

    if(token && this.user.id) {
      this.store.dispatch(new UpdateUserById({user: this.user, token: token}))

      this.actions$
        .pipe(
          ofActionErrored(UpdateUserById)
        )
        .subscribe(() => {
          const response = this.store.selectSnapshot(UserState.getUpdateUserResponse);
            if(response && response.status === 400 && response.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')){
              const errorMessage = response.error;
              this.toastr.error(errorMessage.substr(44));
            } else if (response && response.status === 401) {
              this.toastr.error('Something went wrong');
            } else if(response && response.status === 400) {
              this.toastr.error('Please type valid data');
            }
        })

      this.actions$
        .pipe(
        ofActionSuccessful(UpdateUserById)
      )
        .subscribe(_ => {
          this.lift.emit(true);
          this.editing = false;
          this.toastr.success('Updated')
        })
    }
  }

  updateUser() {
    this.user = {...this.user, ...this.userDetailsGroup.value};
    this.requestForUpdateUser();
  }

  cancelEditing() {
    this.editing = false;
    this.initUserDetailsGroup();
  }

  deleteUser(): void {
    const token = this.tokenService.getToken();
    let dialogRef = this.dialog.open(DialogDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(!+result && this.user.id && token){
        this.store.dispatch(new DeleteUserById({id: this.user.id, token: token}));

        this.actions$
          .pipe(
            ofActionErrored(DeleteUserById)
          )
          .subscribe(() => {
            this.toastr.error('Something went wrong')
          })

        this.actions$
          .pipe(
            ofActionSuccessful(DeleteUserById)
          )
          .subscribe(() => {
                this.toastr.success('Deleted');
                this.lift.emit(true);
          })
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

  updateUserAddress(): void {
    this.user.userAddress.map((value) => {
      return {...value, postalCode: +value.postalCode}
    })
    this.user = {...this.user, ...this.userDetailsGroup.value}
    this.requestForUpdateUser()
  }

  deleteUserAddress(index: number): void {
    let dialogRef = this.dialog.open(DialogDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(+result) {
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
