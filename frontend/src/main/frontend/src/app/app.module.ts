import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
/*routing*/
import { routing } from './app.routing';
import { districtsRouting } from "./districts/districts.routing";
import { transportersRouting } from "./transporters/transporters.routing";
import { ironkeysRouting } from "./ironkeys/ironkeys.routing";
import { sendsRouting } from "./sends/sends.routing";
import { receivesRouting } from "./receives/receives.routing";
import { usersRouting } from "./users/users.routing";
import { loginsRouting } from "./login/logins.routing";
import { homesRouting } from "./home/home.routing";
import { evaluationsRouting } from "./evaluations/evaluations.routing";
import { serversRouting } from "./servers/servers.routing";
import { syncsRouting } from "./syncs/syncs.routing";
/*SCB Modules */
import { DistrictsModule } from "./districts/districts.module";
import { TransportersModule } from "./transporters/transporters.module";
import { IronkeysModule } from "./ironkeys/ironkeys.module";
import { SendsModule } from "./sends/sends.module";
import { ReceivesModule } from "./receives/receives.module";
import { UsersModule } from "./users/users.module";
import { PersonsModule } from "./persons/persons.module";
import { AuthoritiesModule } from "./authorities/authorities.module";
import { EvaluationsModule } from "./evaluations/evaluations.module";
import { LoginsModule } from "./login/logins.module";
import { HomesModule } from "./home/home.module";
import { NavBarModule } from "./nav-bar/nav-bar.module";
import { ServersModule } from "./servers/servers.module";
import { SyncsModule } from "./syncs/syncs.module";
import { ResourcesModule } from "./resources/resources.module";
/*AuthManagers*/
import { AuthManagerIronkeysRead } from './ironkeys/authmanagerread';
import { AuthManagerIronkeysEdit } from './ironkeys/authmanageredit';
import { AuthManagerDistrictsRead } from './districts/authmanagerread';
import { AuthManagerDistrictsEdit } from './districts/authmanageredit';
import { AuthManagerTransportersRead } from './transporters/authmanagerread';
import { AuthManagerTransportersEdit } from './transporters/authmanageredit';
import { AuthManagerUsersRead } from './users/authmanagerread';
import { AuthManagerUsersEdit } from './users/authmanageredit';
import { AuthManagerSendsRead } from './sends/authmanagerread';
import { AuthManagerSendsEdit } from './sends/authmanageredit';
import { AuthManagerReceivesRead } from './receives/authmanagerread';
import { AuthManagerReceivesEdit } from './receives/authmanageredit';
import { AuthManagerEvaluationsRead } from './evaluations/authmanagerread';
import { AuthManagerEvaluationsEdit } from './evaluations/authmanageredit';
import { AuthManagerServersRead } from './servers/authmanagerread';
import { AuthManagerServersEdit } from './servers/authmanageredit';
import { AuthManagerSyncsRead } from './syncs/authmanagerread';
import { AuthManagerSyncsEdit } from './syncs/authmanageredit';
/** Fix 404 error on page refresh */
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TranslateModule } from "ng2-translate";
/** Services*/
import { NavbarService } from "././nav-bar/nav-bar.service";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    DistrictsModule,
    TransportersModule,
    IronkeysModule,
    SendsModule,
    ReceivesModule,
    UsersModule,
    PersonsModule,
    AuthoritiesModule,
    LoginsModule,
    EvaluationsModule,
    HomesModule,
    NavBarModule,
    ServersModule,
    SyncsModule,
    ResourcesModule,
    districtsRouting,
    transportersRouting,
    ironkeysRouting,
    sendsRouting,
    receivesRouting,
    usersRouting,
    loginsRouting,
    homesRouting,
    evaluationsRouting,
    serversRouting,
    syncsRouting,
    routing,
    TranslateModule.forRoot()
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthManagerIronkeysRead,
    AuthManagerIronkeysEdit,
    AuthManagerDistrictsRead,
    AuthManagerDistrictsEdit,
    AuthManagerTransportersRead,
    AuthManagerTransportersEdit,
    AuthManagerUsersRead,
    AuthManagerUsersEdit,
    AuthManagerSendsRead,
    AuthManagerSendsEdit,
    AuthManagerReceivesRead,
    AuthManagerReceivesEdit,
    AuthManagerEvaluationsRead,
    AuthManagerEvaluationsEdit,
    AuthManagerServersRead,
    AuthManagerServersEdit,
    AuthManagerSyncsRead,
    AuthManagerSyncsEdit,
    NavbarService
  ],
  bootstrap: [AppComponent]
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class AppModule { }
