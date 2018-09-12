/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SendsService } from "../sends/shared/sends.service";
import { Send } from "../sends/shared/send";
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { DistrictsService } from './../districts/shared/districts.service';
import { District } from './../districts/shared/district';
import { TranslateService } from 'ng2-translate';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-receives',
  templateUrl: './receives.component.html',
  styleUrls: ['./receives.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class ReceivesComponent implements OnInit {
  public sends: Send[] = [];
  public send: Send = new Send();
  public receives; receivesreport: Receive[] = [];
  public receive: Receive = new Receive();
  public from; until; district_id; p;
  public alldistricts: District[] = [];
  public form: FormGroup;
  public received; canceled: boolean;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD; isHidden; isHidden2m: string;
  public user: Object[] = [];

  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyymmdd',
    onClose: () => this.search()
  };
  public total; totali: number = 0;

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
    this.from = "";
    this.until = "";
    this.district_id = "";
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');

    this.districtsService.findDistricts("", "", "", false)
      .subscribe(data => {
        this.alldistricts = data.content;
      });
    this.getPageSend(1);
  }

  getPageSend(page: number) {

    this.isHidden = "";
    this.sendsService.findAllSends(page, 10, this.received, this.canceled, this.from, this.until, this.district_id)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.sends = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
          this.sends = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  getPageReceive(page: number) {

    this.isHidden = "";
    this.receivesService.findAllReceives(page, 10, this.canceled, this.from, this.until, this.district_id)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.receives = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
          this.receives = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  printSend() {
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var doc = new jsPDF();
    var send = this.send;
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

    doc.text(send.district.province + " / " + send.district.name, 40, 55);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 60, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Data do Backup:', 49, 65);
    doc.text(this.datepipe.transform(send.backup_date, 'dd/MM/yyyy'), 110, 65);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 70, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Actualização Terminada?', 49, 75);
    if (send.update_finished == true) {
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
    if (send.sync_finished == true) {
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
    if (send.cross_dhis2_finished == true) {
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
    if (send.cross_idart_finished == true) {
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
    if (send.validation_finished == true) {
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
    var splitTitle = doc.splitTextToSize(send.observation, 72);
    doc.text(splitTitle, 110, 125);
    doc.text('_______________________________', 30, 180);
    doc.setFontSize(11);
    doc.text(user.person.others_names + ' ' + user.person.surname + "\n(" + user.person.phone_number + ")", 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(send.transporter.role + ": " + send.transporter.name + "\n(" + send.transporter.phone_number + ")", 30, 205);
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
    doc.text('DIE-SIS', 200, 290, null, null, 'right');
    doc.save('SCB_Protocolo_Envio_' + send.district.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
  }

  setSend(uuid) {
    this.send = this.sends.find(item => item.uuid == uuid);
    this.isHidden2m = "hide";
    if (this.send.received == true) {
      this.isHidden2m = "";
      this.receivesService.findOneReceiveBySendUuid(uuid)
        .subscribe(data => {
          this.receive = data;
          if (this.receive != null) {
            this.send.receivername = this.receive.created_by.person.others_names + " " + this.receive.created_by.person.surname;
            this.send.receivedate = this.receive.receive_date;
            this.send.restored = this.receive.restored;
            if (this.receive.restored_by != null) {
              this.send.restorername = this.receive.restored_by.person.others_names + " " + this.receive.restored_by.person.surname;
            }
            this.send.date_restored = this.receive.date_restored;
            this.send.sis_observation = this.receive.observation;
            this.send.ik_returned = this.receive.ik_returned;
            if (this.send.ik_returned) {
              this.send.ik_returneddate = this.receive.date_ik_returned;
              this.send.ik_returnedto = this.receive.transporter.name;
            }
          }
        }, error => {
        },
          () => {
            this.isHidden2m = "hide";
          });
    } else {
    }
  }

  setReceive(receive_id) {
    this.receive = this.receives.find(item => item.receive_id == receive_id);
  }


  search() {
    var userValue = this.form.value;


    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
    } else {
      this.district_id = userValue.district;
    }

    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = userValue.backup_from;
        this.until = userValue.backup_until
      } else {
        this.from = "";
        this.until = "";
      }
    } else {
      this.from = "";
      this.until = "";
    }

    if (userValue.received == null || userValue.received == false) {
      this.received = false;
      this.getPageSend(1);
    } else {
      this.received = true;
      this.getPageReceive(1);
    }
  }

  printList() {
    this.isHidden = "";
    var total;

    this.receivesService.findAllReceives(1, 1000000, this.canceled, this.from, this.until, this.district_id)
      .subscribe(data => {
        this.receivesreport = data.content;
        total = data.totalElements;

        if(this.district_id==''){
        for (let d of this.alldistricts) {
          if (!this.receivesreport.find(item => item.districtname == d.namef)) {
            let receive = new Receive();
            receive.districtname = d.namef
            receive.obsd = "Não registou envio de backup neste periodo.";
            this.receivesreport.push(receive);
          }}
        }
      },
        error => {
          this.isHidden = "hide";
          this.receivesreport = [];
        },
        () => {
          this.isHidden = "hide";

          var user = JSON.parse(window.sessionStorage.getItem('user'));
          var doc = new jsPDF('landscape');
          var totalPagesExp = "{total_pages_count_string}";
          var columns = [
            { title: "Distrito/US", dataKey: "districtname" },
            { title: "Data do\nBackup", dataKey: "backup_date_f" },
            { title: "Actualização\nTerminada?", dataKey: "at" },
            { title: "Sincronização\nTerminada?", dataKey: "st" },
            { title: "Cruzamento\ncom DHIS2?", dataKey: "dhis2" },
            { title: "Cruzamento\ncom iDART?", dataKey: "idart" },
            { title: "Validação\nTerminada?", dataKey: "vt" },
            { title: "Enviado\npor", dataKey: "sender" },
            { title: "Observação Distrital", dataKey: "obsd" },
            { title: "Recebido\npor", dataKey: "receiver" }

          ];
          var listSize = total;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // HEADER
          doc.setFontSize(18);
          doc.text('Lista de Backups Recebidos', 14, 22);
          doc.setFontSize(14);
          doc.text(listSize + ' backups, efectuados de ' + this.from+ ' até ' + this.until + '.', 14, 45);
          doc.setFontSize(11);
          doc.setTextColor(100);
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          var text = doc.splitTextToSize('Backups efectuados num determinado periodo que foram recebidos pelo SIS.', pageWidth - 25, {});
          doc.text(text, 14, 32);

          var pageContent = function (data) {
            // FOOTER
            var str = "Página " + data.pageCount;
            if (typeof doc.putTotalPages === 'function') {
              str = str + " de " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 5);
          };
          doc.autoTable(columns, this.receivesreport, {
            startY: 50,
            styles: { overflow: 'linebreak' },
            bodyStyles: { valign: 'top' },
            columnStyles: {
              districtname: { columnWidth: 35, fontSize: 10 },
              backup_date_f: { columnWidth: 23, fontSize: 10 },
              at: { columnWidth: 25 },
              st: { columnWidth: 27 },
              dhis2: { columnWidth: 24 },
              idart: { columnWidth: 25 },
              vt: { columnWidth: 24 },
              sender: { columnWidth: 23, fontSize: 10 },
              obsd: { columnWidth: 40, fontSize: 10 },
              receiver: { columnWidth: 23, fontSize: 10 }

            },
            theme: 'grid',
            headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
            addPageContent: pageContent
          });
          doc.setFontSize(11);
          doc.setTextColor(100);
          doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
          doc.setTextColor(0, 0, 200);
          doc.textWithLink('Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
          }
          doc.save('SCB_Backups recebidos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');

        }
      );
  }
}
