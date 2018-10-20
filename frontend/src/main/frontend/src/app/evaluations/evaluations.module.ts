/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { EvaluationsComponent } from './evaluations.component';
import { EvaluationsService } from './shared/evaluations.service';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzDropdownModule } from 'ngx-materialize';
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
    MzToastModule,
    MzSelectModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzDropdownModule
  ],
  declarations: [
    EvaluationsComponent,
    EvaluationFormComponent
  ],
  exports: [
    EvaluationsComponent
  ],
  providers: [
    EvaluationsService
  ]
})

/**
 * @author Damasceno Lopes
 */
export class EvaluationsModule { }