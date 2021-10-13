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
import {Select, Store} from "@ngxs/store";
import {AddFullUser} from "../../store/actions/users.actions";
import {UserState} from "../../store/states/users.state";
import {Observable} from "rxjs";
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
@UntilDestroy()
export class MainComponent implements OnInit {
  user: IFullUser;

  @Select(UserState.getFullUser) fullUser$: Observable<IFullUser>

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

    this.userService.getUserByEmail(decodedToken.sub, token)
      .pipe(
        untilDestroyed(this),
        tap(user => this.store.dispatch(new AddFullUser(user))),
        tap(_ => this.fullUser$),
        untilDestroyed(this)
      )
      .subscribe(user => {
        this.fullUser$.subscribe(fullUser => this.user = fullUser);
    }, error => this.toastr.error('Something went wrong'))
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
