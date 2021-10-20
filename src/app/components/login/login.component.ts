import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {Actions, ofActionErrored, ofActionSuccessful, Store} from "@ngxs/store";
import { LoginUser} from "../../store/actions/users.actions";
import {UserState} from "../../store/states/users.state";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private tokenService: TokenService,
              private store: Store,
              private actions$: Actions) { }

  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  get getFormControls() {
    return this.loginGroup.controls;
  }

  loginUser(): void {
    const user = this.loginGroup.getRawValue();
    this.store.dispatch(new LoginUser(user));
    this.actions$
      .pipe(
        ofActionErrored(LoginUser)
      )
      .subscribe(() => {
        const response = this.store.selectSnapshot(UserState.getUpdateUserResponse);
        if(response && response.status === 401){
          this.router.navigate(['mainInfo']);
        }
      })
    this.actions$
      .pipe(
        ofActionSuccessful(LoginUser)
      )
      .subscribe(() => {
        const response = this.store.selectSnapshot(UserState.getLoginResponse);
        if(response.token){
          this.tokenService.setToken(response.token);
          this.router.navigate(['main']);
        }
      })
  }
}
