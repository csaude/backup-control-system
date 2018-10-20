/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { DistrictsComponent } from './districts.component';
import { DistrictsService } from './shared/districts.service';
import { DistrictFormComponent } from './district-form/district-form.component';
import { DatePipe } from '@angular/common';
import { MzTooltipModule, MzSelectModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule, MzDatepickerModule,MzDropdownModule } from 'ngx-materialize';
import { TranslateModule } from "ng2-translate";
import { NgxPaginationModule } from 'ngx-pagination';

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
    MzToastModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzSelectModule,
    MzDatepickerModule,
    NgxPaginationModule,
    MzDropdownModule
  ],
  declarations: [
    DistrictsComponent,
    DistrictFormComponent
  ],
  exports: [
    DistrictsComponent
  ],
  providers: [
    DistrictsService,
    DatePipe
  ]
})

/** 
 * @author Damasceno Lopes
 */
export class DistrictsModule { }