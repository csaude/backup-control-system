/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SendsService } from "../sends/shared/sends.service";
import { Send } from "../sends/shared/send";
import * as jsPDF from "jspdf";
import { DatePipe } from '@angular/common';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { DistrictsService } from './../districts/shared/districts.service';
import { District } from './../districts/shared/district';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-receives',
  templateUrl: './receives.component.html',
  styleUrls: ['./receives.component.css']
})
export class ReceivesComponent implements OnInit {
  public sends: Send[] = [];
  public send_id: number;
  public send: Send = new Send();
  public isHidden;isHidden2m: string;
  public allsends: Send[] = [];
  public allsends2: Send[] = [];
  public receives: Receive[] = [];
  public receive: Receive = new Receive();
  public p;
  public alldistricts: District[] = [];
  public form: FormGroup;
  public received;districts_filter;districtr_filter: boolean;
  
  public user: Object[] = [];
  public district_id: number;
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
    onClose: () => this.search()
  };
  public total; totali; number = 0;
  constructor(public datepipe: DatePipe, public sendsService: SendsService, public receivesService: ReceivesService,
    public translate: TranslateService,public districtsService: DistrictsService, formBuilder: FormBuilder) {
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
    this.districts_filter=false;
    this.districtr_filter=false;
    this.districtsService.getDistricts()
            .subscribe(data => {
              this.alldistricts = data;
              this.alldistricts.sort(function (a, b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            });
    this.getPageSend(1);
  }

  getPageSend(page: number) {
  
    this.isHidden = "";
    this.sendsService.getAllSendsNotReceived(page, 10)
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
  getPageSendByDistrict(page: number) {
    this.isHidden = "";
    this.sendsService.getSendsByDistrict(page, 10,this.district_id)
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
    this.receivesService.getAllReceived(page, 10)
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
  getPageReceiveByDistrict(page: number) {
 
    this.isHidden = "";
    this.receivesService.getReceivesByDistrict(page, 10,this.district_id)
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
    var user = JSON.parse(window.localStorage.getItem('user'));
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
    
    doc.text(send.district.province+" / "+send.district.name, 40, 55);
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
    doc.text(user.person.others_names + ' ' + user.person.surname+"\n("+user.person.phone_number+")", 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(send.transporter.role+": "+send.transporter.name+"\n("+send.transporter.phone_number+")", 30, 205);
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
  printSend2() {
    var user = JSON.parse(window.localStorage.getItem('user'));
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
    
    doc.text(send.district.province+" / "+send.district.name, 40, 55);
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
    doc.text(user.person.others_names + ' ' + user.person.surname+"\n("+user.person.phone_number+")", 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(this.receive.transporter.role+": "+this.receive.transporter.name+"\n("+this.receive.transporter.phone_number+")", 30, 205);
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
  setSendid(send_id) {
    this.send_id = send_id;
  }
  setSend(send_id) {
    this.send = this.sends.find(item => item.send_id == send_id);
  
    if(this.send.received==true){
      this.receivesService.getReceiveBySendId(send_id)
        .subscribe(data => {
          this.receive = data;
          if (this.receive != null) {
            this.send.receivername = this.receive.created_by.person.others_names+" "+this.receive.created_by.person.surname;
            this.send.receivedate = this.receive.receive_date;
            this.send.restored = this.receive.restored;
            if(this.receive.restored_by!=null){
              this.send.restorername = this.receive.restored_by.person.others_names+" "+this.receive.restored_by.person.surname;
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
           
          });
        }else{
        }
  }
  setSend2(uuid) {
    this.receive = this.receives.find(item => item.uuid == uuid);
    this.sendsService.getSend(this.receive.send.uuid).subscribe(data => {
      this.send=data;
    },error=>{},
  ()=>{
    this.printSend2();
  });
  }
  setReceive(receive_id) {
    this.receive = this.receives.find(item => item.receive_id == receive_id);
  }

 
  search(){
    var userValue = this.form.value;
    if(userValue.received==true){
      this.sends= this.allsends2.filter(item => item.received==true);
    }
    else{
      this.sends= this.allsends2.filter(item => item.received==false);
    }
    if(userValue.district&&userValue.district!="all"){
      this.sends=this.sends.filter(item => item.district.district_id == userValue.district);
    }
    else if (userValue.district&&userValue.district!=="all"){
      this.sends=this.allsends;
    }
    if(userValue.backup_from&&userValue.backup_until){
      if(userValue.backup_from<=userValue.backup_until){
        this.sends= this.sends.filter(item => this.datepipe.transform(item.backup_date,'yyyy-MM-dd')>=userValue.backup_from && this.datepipe.transform(item.backup_date,'yyyy-MM-dd')<=userValue.backup_until);
      }
    }
    
    
  }
  search2() {
    var userValue = this.form.value;
    if (userValue.received==null || userValue.received==false) {
      this.received = false;
      if (((userValue.backup_from==""||userValue.backup_from==null)&&(userValue.backup_until==""||userValue.backup_until==null))&&(userValue.district=="all"||userValue.district==null)) {
        this.isHidden = "";
        this.getPageSend(1);
      }
      else if(((userValue.backup_from==""||userValue.backup_from==null)&&(userValue.backup_until==""||userValue.backup_until==null))&&(userValue.district!="all"||userValue.district!=null)){
        this.districts_filter=true;
        this.district_id = userValue.district;
        this.isHidden = "";
        this.getPageSendByDistrict(1);
       
      }
      }
    else {
      this.received = true;
     if (((userValue.backup_from==""||userValue.backup_from==null)&&(userValue.backup_until==""||userValue.backup_until==null))&&(userValue.district=="all"||userValue.district==null)) {
        this.isHidden = "";
        this.getPageReceive(1);
      }
      else if(((userValue.backup_from==""||userValue.backup_from==null)&&(userValue.backup_until==""||userValue.backup_until==null))&&(userValue.district!="all"||userValue.district!=null)){
        this.districtr_filter=true;
        this.district_id = userValue.district;
        this.isHidden = "";
        this.getPageReceiveByDistrict(1);
      }
  }
  }
}
