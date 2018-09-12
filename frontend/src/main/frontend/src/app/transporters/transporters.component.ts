/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransportersService } from "./shared/transporters.service";
import { Transporter } from "./shared/transporter";
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
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
  
     
  constructor(
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: [],
      role: [],
      canceled: []
    });
  }
  ngOnInit() {
    this.name = "";
    this.role = "";
    this.canceled = false;
    this.getPage(1);
  }
  getPage(page: number) {
    this.isHidden = "";
    this.transportersService.findTransporters(page, 10, this.name, this.role, this.canceled)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.transporters = data.content;
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
    if (userValue.name) {
      this.name = userValue.name;
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
  deleteTransporter() {
    this.isHidden = "";
    this.transportersService.deleteTransporter(this.transporter.uuid)
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
  setTransporter(uuid) {
    this.transporter = this.transporters.find(item => item.uuid == uuid);
  }
  showMsg(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', não pode ser excluido!', 2000, 'red', null);
  }
}
