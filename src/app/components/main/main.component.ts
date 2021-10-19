import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TokenService} from "../../services/token.service";
import {IFullUser} from "../../models/fullUser";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {LogoutModalComponent} from "../logout-modal/logout-modal.component";
import {Store} from "@ngxs/store";
import {GetUserByEmail} from "../../store/actions/users.actions";
import {UserState} from "../../store/states/users.state";
import {switchMap, take} from 'rxjs/operators';

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
              private toastr: ToastrService,
              private dialog: MatDialog,
              private store: Store) { }

  ngOnInit(): void {
    const decodedToken = this.tokenService.decodeToken();
    const token = this.tokenService.getToken();

    if(!token) return;
    this.store.dispatch(new GetUserByEmail(decodedToken.sub, token))
      .pipe(
        take(1),
        switchMap(() => this.store.selectOnce(UserState.getFullUser))
      )
      .subscribe(fullUser => this.user = fullUser);
  }

  logout() {
    let dialogRef = this.dialog.open(LogoutModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(!+result) {
        this.tokenService.removeToken();
        this.router.navigate(['login'])
      }
    })
  }

  goToSearch() {
    this.router.navigate(['search'])
  }
}
