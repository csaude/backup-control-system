/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from "./shared/evaluations.service";
import { Evaluation } from "./shared/evaluation";
//import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations2.component.html',
  styleUrls: ['./evaluations.component.css']
})

/**
 * @author Damasceno Lopes
 */
export class EvaluationsComponent implements OnInit {
  public evaluations: Evaluation[] = [];
  public evaluation: Evaluation = new Evaluation();
  public isHidden;name;openmrs_sql_dataset_uid: string;
  public p: number = 1;
  public total: number = 0;


  public next;previous: number=0;
  public first; last; range: string;

  public nameValueControl = new FormControl();
  public openmrsValueControl = new FormControl();
  public formCtrlSub: Subscription;
  public pageSize: number;
   
  constructor(
    public evaluationsService: EvaluationsService,
    //public toastService: MzToastService,
    public translate: TranslateService) {
  }

  ngOnInit() {
    this.name = "";
    this.openmrs_sql_dataset_uid = "";
    this.pageSize=10
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
    .debounceTime(600)
    .subscribe(newValue => {
      this.name = this.nameValueControl.value;
      this.search();
    });

    this.formCtrlSub = this.openmrsValueControl.valueChanges
    .debounceTime(600)
    .subscribe(newValue => {
      this.openmrs_sql_dataset_uid = this.openmrsValueControl.value;
      this.search();
    });
  }

  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";
    this.evaluationsService.findEvaluations(page, this.pageSize, this.name, this.openmrs_sql_dataset_uid,"description,name,openmrsSqlUuid,uid,dateCreated,dateUpdated,createdBy.personName,updatedBy.personName")
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.evaluations = data.content;
        this.next = page + 1;
        this.previous = page - 1;
        if (data.first == true && data.last == true) {
          this.first = "disabled";
          this.last = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + data.totalElements;
        }
        else if (data.first == true && data.last == false) {
          this.first = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + (page * this.pageSize);
        }
        else if (data.first == false && data.last == true) {
          this.last = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + data.totalElements;
        }
        else if (data.first == false && data.last == false) {
          this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + + (page * this.pageSize);
        }
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
          this.evaluations = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  search() {
  
    if (this.name) {
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }
    if (this.openmrs_sql_dataset_uid) {
      this.openmrs_sql_dataset_uid = this.openmrs_sql_dataset_uid.split("-").join("SPACEIFEN");
    } else {
      this.openmrs_sql_dataset_uid = "";
    }
    this.getPage(1);
  }

  searchSize(){
    this.getPage(1);
  }

  deleteEvaluation() {
    this.isHidden = "";
    this.evaluationsService.deleteEvaluation(this.evaluation.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.showMsg(this.evaluation.name);
        } else {
          this.isHidden = "hide";
        }
      },
        error => {
        }
      );
  }

  setEvaluation(uid) {
    this.evaluation = this.evaluations.find(item => item.uid == uid);
  }


  showMsg(evaluation) {
   // this.toastService.show('Avaliação: ' + evaluation + ', excluida com sucesso!', 2000, 'green', null);
  }

}
