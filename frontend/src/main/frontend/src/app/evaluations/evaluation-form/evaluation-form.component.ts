/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Evaluation } from '../shared/evaluation';
import { EvaluationsService } from '../shared/evaluations.service';
//import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form2.component.html',
  styleUrls: ['./evaluation-form.component.css']
})

/** 
 * @author Damasceno Lopes
 */
export class EvaluationFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public evaluation: Evaluation = new Evaluation();
  public user: any;

   
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public evaluationsService: EvaluationsService,
    //public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      openmrsSqlUuid: ['', [
        Validators.required
      ]],
      description: []
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uid = params['uid'];
      this.title = uid ? 'Editar Avaliação' : 'Nova Avaliação';
      this.isHidden = uid ? '' : 'hide';
      if (!uid) {
        return;
      } else {
        this.evaluationsService.findOneEvaluationByUuid(uid,"evaluationId,name,openmrsSqlUuid,uid,dateCreated,createdBy.userId,createdBy.uid,description")
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
    if (this.evaluation.uid) {
      userValue.evaluationId = this.evaluation.evaluationId;
      userValue.dateCreated = this.evaluation.dateCreated;
      userValue.uid = this.evaluation.uid;
      userValue.createdBy = this.evaluation.createdBy;
      userValue.updatedBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
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
      userValue.createdBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
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
   // this.toastService.show('Avaliação: ' + evaluation + ', salvo com sucesso!', 4000, 'green', null);
  }
  showMsgErr() {
   // this.toastService.show('ESta Avaliação ja existe!', 4000, 'red', null);
  }
}