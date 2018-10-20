/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Ironkey } from '../shared/ironkey';
import { IronkeysService } from '../shared/ironkeys.service';
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-ironkey-form',
  templateUrl: './ironkey-form.component.html',
  styleUrls: ['./ironkey-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class IronkeyFormComponent implements OnInit {
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
    today: 'Hoje',
    close: 'Fechar',
    clear:'Limpar',
    max: new Date()
  };
  public sizes = [
    { id: 1, name: '1 GB' },
    { id: 2, name: '2 GB' },
    { id: 4, name: '4 GB' },
    { id: 8, name: '8 GB' },
    { id: 16, name: '16 GB' },
    { id: 32, name: '32 GB' },
    { id: 64, name: '64 GB' },
    { id: 128, name: '128 GB' },
    { id: 256, name: '256 GB' },
    { id: 500, name: '500 GB' },
    { id: 1000, name: '1 TB' },
    { id: 0, name: 'Outra' }
  ];
  public status = [
    { name: "Activado" },
    { name: "Desactivado" },
    { name: "Perdido" },
    { name: "Problema" },
    { name: "Outro" }
  ];
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public ironkey: Ironkey = new Ironkey();
  public ironkeys: Ironkey[] = [];
  public serial = null;
  public user: any;
   
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public ironkeysService: IronkeysService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      serial: ['', [
        Validators.required
      ]],
      size: ['', [
        Validators.required
      ]],
      status: ['', [
        Validators.required
      ]],
      version: ['', [
        Validators.required
      ]],
      observation: [],
      datePurchased: []
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uid = params['uid'];
      this.title = uid ? 'Editar Ironkey' : 'Novo Ironkey';
      this.isHidden = uid ? '' : 'hide';
      if (!uid) {
        return;
      }
      else {
        this.ironkeysService.findOneIronkeyByUuid(uid,"ironkeyId,size,serial,version,dateCreated,createdBy.userId,createdBy.uid,datePurchased,status,uid,observation")
          .subscribe(
            ironkey => {
              this.ironkey = ironkey;
              this.serial = ironkey.serial;
            },
            error => {
              if (error.status == 404) {
                this.router.navigate(['NotFound']);
              }
            }, () => {
            });
      }
    });
  }

  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    if (this.ironkey.uid) {
      userValue.ironkeyId = this.ironkey.ironkeyId;
      userValue.dateCreated = this.ironkey.dateCreated;
      userValue.uid = this.ironkey.uid;
      userValue.createdBy = this.ironkey.createdBy;
      userValue.updatedBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };

        result = this.ironkeysService.updateIronkey(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['ironkeys']);
            this.showMsg(userValue.serial);
          } else {
            this.showMsgErr();
            this.isDisabled = false;
          }
        }, error => {
        },
          () => {
          });
      
    } else {
      userValue.createdBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
      result = this.ironkeysService.createIronkey(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['ironkeys']);
          this.showMsg(userValue.serial);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      });
    }
  }
  showMsg(ironkey) {
    this.toastService.show('Iron Key: ' + ironkey + ', salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('Este Ironkey ja existe!', 2000, 'red', null);
  }
}