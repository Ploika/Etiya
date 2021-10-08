import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@UntilDestroy()
export class LoginComponent implements OnInit {
  loginGroup: FormGroup;
  token: string
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private tokenService: TokenService) { }

  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  get getFormControls(): any {
    return this.loginGroup.controls
  }

  loginUser(): void {
    const user = this.loginGroup.getRawValue()
    this.authService.login(user)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(response => {
      if(response.token) this.tokenService.setToken(response.token)
      this.router.navigate(['main'])
    }, error => {
      if(error.status === 401) this.router.navigate(['mainInfo'])
    })
  }
}
