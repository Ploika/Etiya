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
export class MainInfoComponent implements OnInit {
  userMainData: FormGroup;
  constructor(private router: Router,
              private fb: FormBuilder,
              private dataTransfer: DataService) {

    this.userMainData = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
    },  { validators: this.checkPasswords })
  }

  ngOnInit(): void {
  }
  get getFormControls(): any {
    return this.userMainData.controls
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  sendData(): void{
   if (!this.userMainData.valid) {
     this.userMainData.markAllAsTouched()
   }
   if(this.userMainData.valid) {
     this.dataTransfer.store
       .pipe(
         untilDestroyed(this)
       )
       .subscribe(value => value.push(this.userMainData.getRawValue()))
     this.router.navigate(['addressInformation'])
   }
  }
}
