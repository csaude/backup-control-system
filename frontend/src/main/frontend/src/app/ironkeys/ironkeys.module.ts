/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { IronkeysComponent } from './ironkeys.component';
import { IronkeysService } from './shared/ironkeys.service';
import { IronkeyFormComponent } from './ironkey-form/ironkey-form.component';
import { MzTooltipModule, MzSelectModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzDatepickerModule,MzDropdownModule } from 'ngx-materialize';
import { TranslateModule } from "ng2-translate";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule, 
    RouterModule,
    HttpModule,
    MzTooltipModule,
    MzSelectModule,
    MzIconMdiModule,
    MzIconModule,
    MzModalModule,
    MzToastModule,
    MzDropdownModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzDatepickerModule
  ],
  declarations: [
    IronkeysComponent,
    IronkeyFormComponent
  ],
  exports: [
    IronkeysComponent
  ],
  providers: [
    IronkeysService
  ]
})

/** 
* @author Damasceno Lopes
*/
export class IronkeysModule { }