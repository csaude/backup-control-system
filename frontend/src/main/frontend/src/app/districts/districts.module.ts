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
import { TranslateModule } from "ng2-translate";

/* Angular Material */
import {DialogOverviewExampleDialog } from './districts.component';
import {DialogOverviewExampleDialog2 } from './districts.component';
import {DialogOverviewExampleDialog3 } from './districts.component';
import {DialogOverviewExampleDialog4 } from './districts.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpModule,
    TranslateModule,

    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule
  ],
  declarations: [
    DistrictsComponent,
    DistrictFormComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog2,
    DialogOverviewExampleDialog3,
    DialogOverviewExampleDialog4
  ],
  exports: [
    DistrictsComponent
  ],
  providers: [
    DistrictsService,
    DatePipe
  ],
  entryComponents:[
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog2,
    DialogOverviewExampleDialog3,
    DialogOverviewExampleDialog4
  ]
})

/** 
 * @author Damasceno Lopes
 */
export class DistrictsModule { }