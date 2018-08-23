/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ServersComponent } from './servers.component';
import { ServersService } from './shared/servers.service';
import { ServerFormComponent } from './server-form/server-form.component';
import { MzTooltipModule, MzSelectModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzDatepickerModule } from 'ng2-materialize';
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
    TranslateModule,
    MzDatepickerModule
  ],
  declarations: [
    ServersComponent,
    ServerFormComponent
  ],
  exports: [
    ServersComponent
  ],
  providers: [
    ServersService
  ]
})

/** 
* @author Damasceno Lopes
*/
export class ServersModule { }