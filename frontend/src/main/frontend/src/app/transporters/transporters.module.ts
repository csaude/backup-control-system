/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { TransportersComponent } from './transporters.component';
import { TransportersService } from './shared/transporters.service';
import { TransporterFormComponent } from './transporter-form/transporter-form.component';
import { MzTooltipModule, MzSelectModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule } from 'ng2-materialize';
import { NgxPaginationModule } from 'ngx-pagination';
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
    NgxPaginationModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule
  ],
  declarations: [
    TransportersComponent,
    TransporterFormComponent
  ],
  exports: [
    TransportersComponent
  ],
  providers: [
    TransportersService
  ]
})

/** 
* @author Damasceno Lopes
*/
export class TransportersModule { }