import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TokenService} from "../../services/token.service";
import {IFullUser} from "../../models/fullUser";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
@UntilDestroy()
export class MainComponent implements OnInit {
  user: IFullUser;
  constructor(private dataTransfer: DataService,
              private userService: UserService,
              private tokenService: TokenService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    const decodedToken = this.tokenService.decodeToken();
    const token = this.tokenService.getToken();

    if(!token) return;
    this.userService.getUserByEmail(decodedToken.sub, token)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(user => {
        this.user = user;
    }, error => this.toastr.error('Something went wrong'))
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['login'])
  }

  goToSearch() {
    this.router.navigate(['search'])
  }
}
