/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SendsComponent } from './sends.component';
import { SendsService } from './shared/sends.service';
import { SendFormComponent } from './send-form/send-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzDatepickerModule,MzDropdownModule } from 'ngx-materialize';
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
    MzDatepickerModule
  ],
  declarations: [
    SendsComponent,
    SendFormComponent
 ],
  exports: [
    SendsComponent
  ],
  providers: [
    SendsService, DatePipe
  ]
})

/** 
* @author Damasceno Lopes
*/
export class SendsModule { }