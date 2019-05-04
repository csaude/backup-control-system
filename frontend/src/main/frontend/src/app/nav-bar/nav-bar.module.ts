/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NavBarComponent } from './nav-bar.component';
//import { MzIconMdiModule, MzIconModule,MzSidenavModule, MzDropdownModule,MzTooltipModule, MzButtonModule } from 'ngx-materialize';
import { TranslateModule } from "ng2-translate";

/**Angular Material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
   
    TranslateModule, 
    CommonModule,
    RouterModule,
    HttpModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
    
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
