/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SendsComponent } from './sends.component';
import { SendsService } from './shared/sends.service';
import { SendFormComponent } from './send-form/send-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzDatepickerModule } from 'ng2-materialize';
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
export class SendsModule { }