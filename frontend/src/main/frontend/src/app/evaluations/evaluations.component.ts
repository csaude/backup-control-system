/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EvaluationsService } from "./shared/evaluations.service";
import { Evaluation } from "./shared/evaluation";
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})

/**
 * @author Damasceno Lopes
 */
export class EvaluationsComponent implements OnInit {
  public evaluations: Evaluation[] = [];
  public evaluation: Evaluation = new Evaluation();
  public isHidden;name;openmrs_sql_dataset_uuid: string;
  public p: number = 1;
  public total: number = 0;
  public form: FormGroup;

   
  constructor(
    public evaluationsService: EvaluationsService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: [],
      openmrs_sql_dataset_uuid: []
    });
  }

  ngOnInit() {
    this.name = "";
    this.openmrs_sql_dataset_uuid = "";
    this.getPage(1);
  }

  getPage(page: number) {
    this.isHidden = "";
    this.evaluationsService.getEvaluationsPaginated(page, 10, this.name, this.openmrs_sql_dataset_uuid)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.evaluations = data.content;
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
    var userValue = this.form.value;
    if (userValue.name) {
      this.name = userValue.name;
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }
    if (userValue.openmrs_sql_dataset_uuid) {
      this.openmrs_sql_dataset_uuid = userValue.openmrs_sql_dataset_uuid;
      this.openmrs_sql_dataset_uuid = this.openmrs_sql_dataset_uuid.split("-").join("SPACEIFEN");
    } else {
      this.openmrs_sql_dataset_uuid = "";
    }
    this.getPage(1);
  }

  deleteEvaluation() {
    this.isHidden = "";
    this.evaluationsService.deleteEvaluation(this.evaluation.uuid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.getPage(this.p);
          this.showMsg(this.evaluation.name);
          this.isHidden = "hide";
        } else {
          this.isHidden = "hide";
        }
      },
        error => {
        }
      );
  }

  setEvaluation(uuid) {
    this.evaluation = this.evaluations.find(item => item.uuid == uuid);
  }


  showMsg(evaluation) {
    this.toastService.show('Avaliação: ' + evaluation + ', excluida com sucesso!', 2000, 'green', null);
  }

}
