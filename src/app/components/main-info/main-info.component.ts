import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {AddOneUser} from "../../store/actions/users.actions";

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css']
})
@UntilDestroy()
export class MainInfoComponent {
  userMainData: FormGroup;
  constructor(private router: Router,
              private fb: FormBuilder,
              private dataTransfer: DataService,
              private store: Store) {

    this.userMainData = fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['+380', [Validators.required, Validators.minLength(2), Validators.pattern]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
    },  { validators: this.checkPasswords })
  }

  get getFormControls() {
    return this.userMainData.controls
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  sendData(): void{
   if (this.userMainData.invalid) {
     this.userMainData.markAllAsTouched()
   }
   if(this.userMainData.valid) {
     const user = {...this.userMainData.getRawValue()};
     this.store.dispatch(new AddOneUser(user));
     this.router.navigate(['addressInformation']);
   }
  }
}
