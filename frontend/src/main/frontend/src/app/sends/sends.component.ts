/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SendsService } from "./shared/sends.service";
import { Send } from "./shared/send";
import * as jsPDF from "jspdf";
import { DatePipe } from '@angular/common';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { DistrictsService } from '../districts/shared/districts.service';
import { District } from '../districts/shared/district';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-sends',
  templateUrl: './sends.component.html',
  styleUrls: ['./sends.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class SendsComponent implements OnInit {
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD;isHidden; isHidden2m: string;
  public sends: Send[] = [];
  public send: Send = new Send();
  public receive: Receive = new Receive();
  public from; until;district_id;p;
  public alldistricts: District[] = [];
  public form: FormGroup;
  public received; canceled;
  public user: Object[] = []; 
  public pageSize: number;

  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyymmdd',
    today: 'Hoje',
    close: 'Fechar',
    clear:'Limpar',
    max: new Date(),
    onClose: () => {
        this.search();
    }
  };
  public total; totali; number = 0;

  public next;previous: number=0;
  public first; last; range: string;


  constructor(public datepipe: DatePipe, public sendsService: SendsService, public receivesService: ReceivesService,
    public translate: TranslateService, public districtsService: DistrictsService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      district: [],
      backup_from: [],
      backup_until: [],
      received: []
    });
  }
  ngOnInit() {
    this.isHidden = "";
    this.received = false;
    this.canceled = false;
    this.pageSize=15;
    this.from="";
    this.until="";
    this.district_id="";
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');


    this.alldistricts = user.districts;

    this.alldistricts.sort(function (a, b) {
      var nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    this.pageSize=15;
    this.getPage(1);
  }

  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";
    this.sendsService.findSends(page, this.pageSize, this.received, this.canceled, this.from, this.until, this.district_id,"observation,transporter.phoneNumber,transporter.name,district.fullName,received,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.sends = data.content;
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
          this.sends = [];
          console.log(error);
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }
  deleteSend(send) {
    if (confirm("Deseja realmente excluir " + send.name + "?")) {
      var index = this.sends.indexOf(send);
      this.sends.splice(index, 1);
      this.sendsService.deleteSend(send.send_id)
        .subscribe(null,
          err => {
            alert("Could not delete send.");
            // Revert the view back to its original state
            this.sends.splice(index, 0, send);
          }
        );
    }
  }
  printSend() {
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Impresso em: ' + this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm'), 200, 5, null, null, 'right');
    doc.setDrawColor(0);
    doc.setFillColor(2, 136, 209);
    doc.rect(30, 25, 150, 10, 'F')
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Protocolo de Envio de Backup', 70, 31);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    doc.text(this.send.district.fullName, 40, 55);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 60, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Data do Backup:', 49, 65);
    doc.text(this.datepipe.transform(this.send.backupDate, 'dd/MM/yyyy'), 110, 65);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 70, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Actualização Terminada?', 49, 75);
    if (this.send.updateFinished == true) {
      doc.text('Sim', 110, 75);
    } else {
      doc.text('Não', 110, 75);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 80, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Sincronização Terminada?', 49, 85);
    if (this.send.syncFinished == true) {
      doc.text('Sim', 110, 85);
    } else {
      doc.text('Não', 110, 85);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 90, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Cruzamento com DHIS2?', 49, 95);
    if (this.send.crossDhis2Finished == true) {
      doc.text('Sim', 110, 95);
    } else {
      doc.text('Não', 110, 95);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 100, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Cruzamento com iDART?', 49, 105);
    if (this.send.crossIdartFinished == true) {
      doc.text('Sim', 110, 105);
    } else {
      doc.text('Não', 110, 105);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 110, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Validação Terminada?', 49, 115);
    if (this.send.validationFinished == true) {
      doc.text('Sim', 110, 115);
    } else {
      doc.text('Não', 110, 115);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 120, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Observação Distrital:', 49, 125);
    doc.setFontSize(12);
    var splitTitle = doc.splitTextToSize(this.send.observation, 72);
    doc.text(splitTitle, 110, 125);
    doc.text('_______________________________', 30, 180);
    doc.setFontSize(11);
    doc.text(user.person.othersNames+" "+user.person.surname, 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(this.send.transporter.name, 30, 205);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 220);
    doc.text('Oficial de SIS', 30, 225);
    doc.text('Data: ___/ ___/ ____', 140, 180);
    doc.text('Data: ___/ ___/ ____', 140, 200);
    doc.text('Data: ___/ ___/ ____', 140, 220);

    doc.setDrawColor(0);
    doc.setFillColor(2, 136, 209);
    doc.rect(30, 250, 150, 15, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 255);
    doc.textWithLink('Sistema de Controle de Backup', 75, 256, { url: 'http://196.28.230.195:8080/scb' });
    doc.setTextColor(255, 255, 255);
    doc.textWithLink('Mantido por: his@fgh.org.mz', 77, 261, { url: 'mailto:his@fgh.org.mz' });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.save('SCB_Protocolo_Envio_' + this.send.district.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
  }


  setSend(uuid) {
    this.send = this.sends.find(item => item.uid == uuid);
    this.isHidden2m="hide";
    if (this.send.received == true) {
      this.isHidden2m="";
      this.receivesService.findOneReceiveBySendUuid(uuid,"createdBy.uid,createdBy.userId,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored")
        .subscribe(data => {
          this.receive = data;
          if (this.receive != null) {
            this.send.receivername = this.receive.createdBy.personName;
            this.send.receivedate = this.receive.receiveDate;
            this.send.restored = this.receive.restored;
            if (this.receive.restoredBy != null) {
              this.send.restorername = this.receive.restoredBy.personName;
            }
            this.send.date_restored = this.receive.dateRestored;
            this.send.sis_observation = this.receive.observation;
            this.send.ik_returned = this.receive.ikReturned;
            if (this.send.ik_returned) {
              this.send.ik_returneddate = this.receive.dateIkReturned;
              this.send.ik_returnedto = this.receive.transporter.name;
            }
          }
        }, error => {
        },
          () => {
            this.isHidden2m="hide";
          });
    } else {
      this.isHidden2m="hide";
    }
  }

  search() {
    var userValue = this.form.value;
    if (userValue.received == null || userValue.received == false) {
      this.received = false;
    } else {
      this.received = true;
    }

    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
    } else {
      this.district_id = userValue.district;
    }

    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = userValue.backup_from;
        this.until = userValue.backup_until
      }else{
        this.from = "";
        this.until = "";
      }
    }else{
      this.from = "";
      this.until = "";
    }

    this.getPage(1);
   
  }

  searchSize(){
    this.getPage(1);
  }

}
