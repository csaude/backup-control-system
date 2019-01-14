/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { ResourcesService } from './shared/resources.service';
import { ExcelService } from './shared/excel.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    ResourcesService,
    ExcelService
  ]
})

/** 
 * @author Damasceno Lopes
 */
export class ResourcesModule { }
