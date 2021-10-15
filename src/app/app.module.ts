import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import { MainInfoComponent } from './components/main-info/main-info.component';
import { AddressInformationComponent } from './components/address-information/address-information.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SearchComponent } from './components/search/search.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserFilterPipe } from './services/user-filter.pipe';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import {AuthGuard} from "./guards/auth.guard";
import {NgxsModule} from "@ngxs/store";
import {UserState} from "./store/states/users.state";
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import {CountriesState} from "./store/states/countries.state";



let routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'mainInfo', component: MainInfoComponent},
  {path: 'addressInformation', component: AddressInformationComponent},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchComponent, canActivate: [AuthGuard]}
]
@NgModule({
  declarations: [
    AppComponent,
    MainInfoComponent,
    AddressInformationComponent,
    MainComponent,
    LoginComponent,
    SearchComponent,
    UserDetailsComponent,
    UserFilterPipe,
    DialogDeleteComponent,
    LogoutModalComponent,

  ],
  entryComponents: [DialogDeleteComponent, LogoutModalComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    NgxsModule.forRoot([
      UserState,
      CountriesState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
