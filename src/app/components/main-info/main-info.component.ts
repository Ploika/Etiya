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
              private dataTransfer: DataService) {

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
     this.dataTransfer.store
       .pipe(
         untilDestroyed(this)
       )
       .subscribe(value => value.push(this.userMainData.getRawValue())) // ...
     this.router.navigate(['addressInformation'])
   }
  }
}
