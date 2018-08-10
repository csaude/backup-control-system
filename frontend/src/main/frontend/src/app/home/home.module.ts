/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "ng2-translate";
import { ChartsModule } from 'ng2-charts';
import { MzTabModule } from 'ng2-materialize'
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ChartsModule,
    MzTabModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  providers: [
  ]
})
export class HomesModule { }
