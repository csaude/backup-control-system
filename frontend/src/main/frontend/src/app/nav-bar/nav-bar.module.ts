/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NavBarComponent } from './nav-bar.component';
import { MzIconMdiModule, MzIconModule,MzSidenavModule, MzDropdownModule,MzTooltipModule, MzButtonModule } from 'ngx-materialize';
import { TranslateModule } from "ng2-translate";

@NgModule({
  imports: [
    MzSidenavModule, 
    MzDropdownModule, 
    TranslateModule, 
    CommonModule,
    RouterModule,
    MzIconMdiModule, 
    MzIconModule,
    HttpModule,
    MzTooltipModule,
    MzButtonModule
  ],
  declarations: [
    NavBarComponent
  ],
  exports: [
    NavBarComponent
  ],
  providers: [
  ]
})

/** 
* @author Damasceno Lopes
*/
export class NavBarModule { }
