import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";
import {IUser} from "../../models/user";
import {IFullUser} from "../../models/fullUser";
import {AuthService} from "../../services/auth.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import { ToastrService } from 'ngx-toastr';
import {ICountries} from "../../models/countries";

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

  constructor(private fb: FormBuilder,
              private dataTransfer: DataService,
              private router: Router,
              private authService: AuthService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.userAddresses.push(this.initFormGroup());
    this.myGroup = new FormGroup({
      userAddresses: this.userAddresses
    })
    this.dataTransfer.store
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(value => this.user = value[0])
    this.authService.getAllCountry()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(countries => this.countries = countries.data)
  }

  get getFormControls(): any {
    return this.addressGroup.controls
  }

  initFormGroup(): FormGroup{
    return this.addressGroup = this.fb.group({
      addressType: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    })
  }

  backToPreviousPage(): void {
    this.dataTransfer.store
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(value => value.pop())
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
      userAddress: this.userAddresses.value
    }
    this.authService.createUser(fullUser)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(data => {
        this.toastr.success('Created');
        this.router.navigate(['login'])
      }, error => {
        if(error.error.includes('ua.lviv.GrTask.Exceptions.UserAlreadyExists:')) {
          const errorMessage = error.error
          this.toastr.error(errorMessage.substr(44))
        }
      })
  }

  addAnotherAddress(): void {
    this.userAddresses.push(this.initFormGroup());
  }
}
