/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Transporter } from '../shared/transporter';
import { TransportersService } from '../shared/transporters.service';
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-transporter-form',
  templateUrl: './transporter-form.component.html',
  styleUrls: ['./transporter-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class TransporterFormComponent implements OnInit {
  public roles = [
    { name: 'Gestor de Dados' },
    { name: 'Gestor de M&A' },
    { name: 'Motorista' },
    { name: 'Oficial Distrital de M&A' },
    { name: 'Oficial Regional de M&A' },
    { name: 'Oficial de SIS' },
    { name: 'Oficial de Análise' },
    { name: 'Outra' },
  ]
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public transporter: Transporter = new Transporter();
  public user: any;
  
     
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      role: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      phoneNumber: [],
      canceled: [],
      canceledReason: []
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uid = params['uid'];
      this.title = uid ? 'Editar Transportador' : 'Novo Transportador';
      this.isHidden = uid ? '' : 'hide';
      if (!uid) {
        return;
      } else {
        this.transportersService.findOneTransporterByUid(uid,"transporterId,name,role,uid,dateCreated,created_by.userId,created_by.uid,canceled,canceledReason,phoneNumber")
          .subscribe(
            transporter => this.transporter = transporter,
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
    if (this.transporter.uid) {
      if (userValue.canceled == true && userValue.canceledReason == null) {
        this.showMsgErr2();
        this.isDisabled = false;
      } else {
        userValue.transporterId = this.transporter.transporterId;
        userValue.dateCreated = this.transporter.dateCreated;
        userValue.uid = this.transporter.uid;
        userValue.createdBy = this.transporter.createdBy;
        userValue.updatedBy = {
          uid: this.user.uid,
          userId: this.user.userId
        };

        result = this.transportersService.updateTransporter(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['transporters']);
            this.showMsg(userValue.name);
          } else {
            this.showMsgErr();
            this.isDisabled = false;
          }
        });
      }
    } else {
      userValue.createdBy = {
        uid: this.user.uid,
        userId: this.user.userId

      };
      result = this.transportersService.createTransporter(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['transporters']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      }
      );
    }
  }

  showMsg(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', salvo com sucesso!', 2000, 'green', null);
  }

  showMsgErr() {
    this.toastService.show('Este Transportador ja existe!', 2000, 'red', null);
  }

  showMsgErr2() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
  
}