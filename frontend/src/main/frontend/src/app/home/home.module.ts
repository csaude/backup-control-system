/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "ng2-translate";
import { ChartsModule } from 'ng2-charts';
import { MzIconMdiModule, MzIconModule,MzTabModule,MzSelectModule,MzTooltipModule } from 'ngx-materialize';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ChartsModule,
    MzTabModule,
    MzIconMdiModule,
    MzIconModule,
    MzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MzTooltipModule
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

/** 
* @author Damasceno Lopes
*/
export class HomesModule { }
