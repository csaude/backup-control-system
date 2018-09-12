/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Evaluation } from '../shared/evaluation';
import { EvaluationsService } from '../shared/evaluations.service';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.css']
})

/** 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export class EvaluationFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public evaluation: Evaluation = new Evaluation();
  public user: Object[] = [];

   
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public evaluationsService: EvaluationsService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      openmrs_sql_dataset_uuid: ['', [
        Validators.required
      ]],
      created_by: [],
      updated_by: [],
      description: []
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Avaliação' : 'Nova Avaliação';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        return;
      } else {
        this.evaluationsService.findOneEvaluationByUuid(uuid)
          .subscribe(
            evaluation => {
              this.evaluation = evaluation;
            },
            response => {
              if (response.status == 404) {
                this.router.navigate(['NotFound']);
              }
            });
      }
    });
  }

 
  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    if (this.evaluation.uuid) {
      userValue.evaluation_id = this.evaluation.evaluation_id;
      userValue.date_created = this.evaluation.date_created;
      userValue.uuid = this.evaluation.uuid;
      userValue.created_by = this.evaluation.created_by;
      userValue.updated_by = this.user;
      result = this.evaluationsService.updateEvaluation(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['evaluations']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      });
    } else {
      userValue.created_by = this.user;
      result = this.evaluationsService.createEvaluation(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['evaluations']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      }
      );
    }
  }

  showMsg(evaluation) {
    this.toastService.show('Avaliação: ' + evaluation + ', salvo com sucesso!', 4000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('ESta Avaliação ja existe!', 4000, 'red', null);
  }
}