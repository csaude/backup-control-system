/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginsService } from './shared/logins.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    LoginFormComponent
  ],
  exports: [
  ],
  providers: [
    LoginsService
  ]
})
export class LoginsModule { }
