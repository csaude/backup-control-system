/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransportersService } from "./shared/transporters.service";
import { Transporter } from "./shared/transporter";
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class TransportersComponent implements OnInit {
  public transporter: Transporter = new Transporter();
  public isHidden: string;
  public transporters: Transporter[] = [];
  public p: number = 1;
  public total: number = 0;
  public form: FormGroup;
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
  public name: string;
  public canceled: boolean;
  public role: string;
  public next;previous: number=0;
  public first; last; range: string;

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
     
  constructor(
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      role: [],
      canceled: []
    });
  }
  ngOnInit() {
    this.name = "";
    this.role = "";
    this.pageSize=15;
    this.canceled = false;
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.name = this.nameValueControl.value;
        this.search();
      });

  }

  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";
    this.transportersService.findTransporters(page, this.pageSize, this.name, this.role, this.canceled,"name,role,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,canceled,canceledBy.personName,canceledReason,phoneNumber,dateCanceled")
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.transporters = data.content;
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
          this.transporters = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }
  search() {
    var userValue = this.form.value;
    if (this.name) {
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }
    if (userValue.role) {
      this.role = userValue.role;
      this.role = this.role.split(" ").join("SPACE").split("&").join("MEAME");
      if (this.role == "all") {
        this.role = "";
      }
    } else {
      this.role = "";
    }
    if (userValue.canceled) {
      this.canceled = userValue.canceled;
    } else {
      this.canceled = false;
    }
    this.getPage(1);
  }

  searchSize(){
    this.getPage(1);
  }

  deleteTransporter() {
    this.isHidden = "";
    this.transportersService.deleteTransporter(this.transporter.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.showMsg(this.transporter.name);
        } else {
          this.showMsgErr(this.transporter.name);
          this.isHidden = "hide";
        }
      },
        error => {
        }
      );
  }
  setTransporter(uid) {
    this.transporter = this.transporters.find(item => item.uid == uid);
  }
  showMsg(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', não pode ser excluido!', 2000, 'red', null);
  }
}
