/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IronkeysService } from "./shared/ironkeys.service";
import { Ironkey } from "./shared/ironkey";
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ironkeys',
  templateUrl: './ironkeys.component.html',
  styleUrls: ['./ironkeys.component.css']
})
export class IronkeysComponent implements OnInit {
  public ironkeys: Ironkey[] = [];
  public p: number = 1;
  public total: number = 0;
  public form: FormGroup;
  public ironkey: Ironkey = new Ironkey();
  public isHidden; isDisabledt: string;
  public serial: string;
  public version: string;
  public status: string;
  public size: string;

  public statuslist = [
    { name: "Activado" },
    { name: "Desactivado" },
    { name: "Perdido" },
    { name: "Com Problema" },
    { name: "Outro" }
  ];
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
    { id: 0, name: 'Outro' }
  ];
  public user;
  constructor(
    public datepipe: DatePipe, 
    public ironkeysService: IronkeysService,
    public toastService: MzToastService,
    public translate: TranslateService, 
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        serial: [],
        version: [],
        status: [],
        size:[]
      });
  }
  ngOnInit() {
    this.serial = "";
    this.version = "";
    this.status = "";
    this.size = "";
    this.getPage(1);
    this.user = JSON.parse(window.localStorage.getItem('user'));
  }
  getPage(page: number) {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.ironkeysService.getIronkeysPaginated(page, 10, this.serial, this.version, this.status,this.size)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.ironkeys = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "disabled";
          this.total = 0;
          this.p = 1;
          this.ironkeys = [];
        },
        () => {
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      );
  }
  search() {
    var userValue = this.form.value;
    if (userValue.serial) {
      this.serial = userValue.serial;
      this.serial = this.serial.split(" ").join("SPACE");
    }
    else {
      this.serial = "";
    }
    if (userValue.status) {
      this.status = userValue.status;
      this.status = this.status.split(" ").join("SPACE");
      if (this.status == "all") {
        this.status = "";
      }
    } else {
      this.status = "";
    }
    if (userValue.size) {
      this.size = userValue.size;
      this.size = this.size;
      if (this.size == "all") {
        this.size = "";
      }
    } else {
      this.size = "";
    }
    if (userValue.version) {
      this.version = userValue.version;
      this.version = this.version.split(" ").join("SPACE");
    }
    else {
      this.version = "";
    }
    this.getPage(1);
  }
  printList() {
    var user = JSON.parse(window.localStorage.getItem('user'));
    var doc = new jsPDF();
    var totalPagesExp = "{total_pages_count_string}";
    var columns = [
      { title: "Nº de Serie", dataKey: "serial" },
      { title: "Versão", dataKey: "version" },
      { title: "Capacidade", dataKey: "sized" },
      { title: "Estado", dataKey: "status" },
      { title: "Nº de Distritos", dataKey: "districtsnumber" }
    ];
    var listSize = this.ironkeys.length;
    var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    var pageContent = function (data) {
      // HEADER
      doc.setFontSize(18);
      doc.text('Visão geral dos Ironkeys', 14, 32);
      doc.setFontSize(14);
      doc.text('Total: ' + listSize + ' registo(s)', 14, 42);
      doc.setFontSize(11);
      doc.setTextColor(100);
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      var text = doc.splitTextToSize('Lista de IronKeys utilizados para transportar copia de segurança da Base de Dados do Sistema Electrónico de Seguimento de Pacientes - OpenMRS, utilizado nos sítios apoiados por FGH. Incluindo o Nº de Distrito(s) que utilizam.', pageWidth - 35, {});
      doc.text(text, 14, 50);
      // FOOTER
      var str = "Página " + data.pageCount;
      if (typeof doc.putTotalPages === 'function') {
        str = str + " de " + totalPagesExp;
      }
      doc.setFontSize(10);
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    };
    doc.autoTable(columns, this.ironkeys, {
      addPageContent: pageContent,
      margin: { top: 70 }
    });
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('\nSCB - Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save('SCB_IronKeys_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
  }
  setIronkey(uuid) {
    this.ironkey = this.ironkeys.find(item => item.uuid == uuid);
  }
  deleteIronkey() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.ironkeysService.deleteIronkey(this.ironkey.uuid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.getPage(this.p);
          this.showMsg(this.ironkey.serial);
          this.isHidden = "hide";
          this.isDisabledt = "";
        } else {
          this.showMsgErr(this.ironkey.serial);
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      }
        ,
        error => {
          alert("Não é possivel excluir o Ironkey!");
          this.isHidden = "hide";
          this.isDisabledt = "";
        },
        () => {
        }
      );
  }
  showMsg(ironkey) {
    this.toastService.show('Iron Key: ' + ironkey + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(ironkey) {
    this.toastService.show('Iron Key: ' + ironkey + ', não pode ser excluido!', 2000, 'red', null);
  }
}