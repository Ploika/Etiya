import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";
import {IUser} from "../../models/user";
import {IFullUser} from "../../models/fullUser";
import {AuthService} from "../../services/auth.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import { ToastrService } from 'ngx-toastr';
import {ICountries} from "../../models/countries";
import {IUserAddress} from "../../models/userAddress";
import {Observable} from "rxjs";
import {Actions, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {UserState} from "../../store/states/users.state";
import {AddOneUser, CreateUser} from "../../store/actions/users.actions";
import {GetAllCountries} from "../../store/actions/countries.actions";
import {ICountryResponse} from "../../models/countryResponse";
import { CountriesState } from 'src/app/store/states/countries.state';

@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.css']
})
@UntilDestroy()
export class AddressInformationComponent implements OnInit {
  addressGroup: FormGroup;
  userAddresses = new FormArray([]);
  myGroup: FormGroup;
  user: IUser;
  countries: ICountries[];

  @Select(UserState.getOneUser) user$: Observable<IUser>;
  @Select(CountriesState.getCountries) countries$: Observable<ICountryResponse>

  constructor(private fb: FormBuilder,
              private dataTransfer: DataService,
              private router: Router,
              private authService: AuthService,
              private toastr: ToastrService,
              private store: Store,
              private actions$: Actions) {
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.userAddresses.push(this.initFormGroup());
    this.myGroup = new FormGroup({
      userAddresses: this.userAddresses
    })

    this.user$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(user => this.user = user);

    this.store.dispatch(new GetAllCountries());

    this.countries$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(countries => this.countries = countries.data)
  }

  get getFormControls() {
    return this.addressGroup.controls;
  }

  initFormGroup(): FormGroup{
    return this.addressGroup = this.fb.group({
      addressType: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    })
  }

  backToPreviousPage(): void {
    this.store.dispatch(new AddOneUser())
    window.history.back();
  }

  saveData(): void {
    let fullUser: IFullUser = {
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phone: this.user.phone,
      userName: this.user.userName,
      password: this.user.password,
      userAddress: (this.userAddresses.value as Array<IUserAddress>).map(value => {
        return {...value, postalCode: +value.postalCode}
      })
    }

    this.store.dispatch(new CreateUser(fullUser));
    this.actions$
      .pipe(
        ofActionErrored(CreateUser)
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
        ofActionSuccessful(CreateUser)
      )
      .subscribe(_ => {
        this.store.dispatch(new AddOneUser());
        this.toastr.success('Created');
        this.router.navigate(['login']);
      })
  }

  addAnotherAddress(): void {
    this.userAddresses.push(this.initFormGroup());
  }
}
