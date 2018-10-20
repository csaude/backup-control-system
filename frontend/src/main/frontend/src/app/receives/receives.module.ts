/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReceivesComponent } from './receives.component';
import { ReceivesService } from './shared/receives.service';
import { ReceiveFormComponent } from './receive-form/receive-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzDatepickerModule,MzCollapsibleModule,MzDropdownModule } from 'ngx-materialize';
import { DatePipe } from '@angular/common';
import { TranslateModule } from "ng2-translate";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpModule,
    MzTooltipModule,
    MzIconMdiModule,
    MzIconModule,
    MzModalModule,
    MzToastModule,MzDropdownModule,
    
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzSelectModule,
    MzDatepickerModule,
    MzDatepickerModule,
    MzCollapsibleModule
  ],
  declarations: [
    ReceivesComponent,
    ReceiveFormComponent
  ],
  exports: [
    ReceivesComponent
  ],
  providers: [
    ReceivesService, DatePipe
  ]
})

/** 
* @author Damasceno Lopes
*/
export class ReceivesModule { }