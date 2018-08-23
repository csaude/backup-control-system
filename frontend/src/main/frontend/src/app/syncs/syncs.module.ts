/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SyncsComponent } from './syncs.component';
import { SyncsService } from './shared/syncs.service';
import { SyncFormComponent } from './sync-form/sync-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzDatepickerModule,MzTimepickerModule  } from 'ng2-materialize';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from "ng2-translate";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpModule,
    MzTimepickerModule,
    MzTooltipModule,
    MzIconMdiModule,
    MzIconModule,
    MzModalModule,
    MzToastModule,
    NgxPaginationModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzSelectModule,
    MzDatepickerModule,
    MzDatepickerModule,
    MzTimepickerModule
  ],
  declarations: [
    SyncsComponent,
    SyncFormComponent
 ],
  exports: [
    SyncsComponent
  ],
  providers: [
    SyncsService, DatePipe
  ]
})

/** 
* @author Damasceno Lopes
*/
export class SyncsModule { }