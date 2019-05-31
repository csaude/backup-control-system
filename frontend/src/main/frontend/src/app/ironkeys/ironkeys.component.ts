import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { IronkeysService } from "./shared/ironkeys.service";
import { Ironkey } from "./shared/ironkey";
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any;
import { DatePipe } from '@angular/common';
import * as myGlobals from '../../globals';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-ironkeys',
  templateUrl: './ironkeys.component.html',
  styleUrls: ['./ironkeys.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class IronkeysComponent implements OnInit {
  public ironkeys;ironkeys1; ironkeysreport: Ironkey[] = [];
  public total; next; previous: number = 0;
  public form: FormGroup;
  public ironkey: Ironkey = new Ironkey();
  public isHidden; isDisabledt: string;
  public serial: string;
  public version: string;
  public status: string;
  public size: string;

  public serialValueControl = new FormControl();
  public versionValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['serial','version','size','status','districts','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;

  public statuslist = [
    { name: "Activado" },
    { name: "Desactivado" },
    { name: "Perdido" },
    { name: "Problema" },
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
    { id: 0, name: 'Outra' }
  ];
  public user;


  constructor(
    public datepipe: DatePipe,
    public ironkeysService: IronkeysService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.form = formBuilder.group({
      status: [],
      size: []
    });
    this.ironkeysService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.deleteIronkey();
      }
    });
  }
  public icon= 'chevron_left';
  public changeIcon(){
    if(this.icon=='chevron_left')
    this.icon='chevron_right';
    else
    this.icon='chevron_left';
  }

  ngOnInit() {
    this.serial = "";
    this.version = "";
    this.status = "";
    this.size = "";
    this.page=0;
    this.pageSize=10;
    this.getPage(1);
    this.user = JSON.parse(window.sessionStorage.getItem('user'));

    this.formCtrlSub = this.serialValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.serial = this.serialValueControl.value;
        this.search();
      });

    this.formCtrlSub = this.versionValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.version = this.versionValueControl.value;
        this.search();
      });

  }

  getPage(event) {

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }

    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.ironkeysService.findIronkeys(this.page+1, this.pageSize, this.serial, this.version, this.status, this.size, "createdBy.phoneNumber,updatedBy.phoneNumber,size,serial,version,districts.fullName,districts.uid,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,datePurchased,status,uid,observation")
      .subscribe(data => {
        this.total = data.totalElements;
        this.ironkeys1 = data.content;
        this.ironkeys = new MatTableDataSource(this.ironkeys1);
        this.ironkeys.sort = this.sort;

        
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "disabled";
          this.total = 0;
          this.ironkeys = [];
          this.ironkeys1 = [];
        },
        () => {
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  search() {
    var userValue = this.form.value;
    if (this.serial) {
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
    if (this.version) {
      this.version = this.version.split(" ").join("SPACE");
    }
    else {
      this.version = "";
    }
    this.page=0;
    this.getPage(1);
  }

  
  printList() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.ironkeysService.findIronkeys("", "", this.serial, this.version, this.status, this.size, "size,serial,version,districts.fullName,status")
      .subscribe(data => {
        this.ironkeysreport = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "";
          this.ironkeysreport = [];
        },
        () => {
          this.isHidden = "hide";
          this.isDisabledt = "";

          var user = JSON.parse(window.sessionStorage.getItem('user'));
          var doc = new jsPDF('portrait');
          var totalPagesExp = "{total_pages_count_string}";
          var columns = [
            { title: "Nº de Serie", dataKey: "serial" },
            { title: "Versão", dataKey: "version" },
            { title: "Tamanho (GB)", dataKey: "size" },
            { title: "Estado", dataKey: "status" },
            { title: "Distrito (s)", dataKey: "districts" }
          ];
          var listSize = this.ironkeysreport.length;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // HEADER
          doc.setFontSize(18);
          doc.text('Lista de Ironkeys', 14, 22);
          doc.setFontSize(14);
          doc.text(listSize + ' ironkeys encontrados.', 14, 45);
          doc.setFontSize(11);
          doc.setTextColor(100);
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          var text = doc.splitTextToSize('Os Ironkeys são utilizados para o transporte de backup de base dados dos Sistemas OpenMRS e iDART.', pageWidth - 25, {});
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
          doc.autoTable(columns, this.ironkeysreport, {
            startY: 50,
            styles: { overflow: 'linebreak' },
            bodyStyles: { valign: 'top' },
            columnStyles: {
              serial: { columnWidth: 60, fontSize: 10 },
              districts: { columnWidth: 50, fontSize: 10 }
            },
            theme: 'grid',
            headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
            addPageContent: pageContent,
            createdCell: function (cell, data) {
              if (data.column.dataKey === 'districts') {
                if (cell.raw == null) {
                  cell.text = "";
                } else {
                  if (cell.raw.length < 2) {
                    for (let i of cell.raw) {
                      cell.text = i.fullName;
                    }
                  } else {
                    var n=1;
                    for (let i of cell.raw) {
                      if (n==1){
                      cell.text = i.fullName;
                      n=n+1;}
                      else{
                      cell.text = cell.text+"\n"+i.fullName;
                      }
                    }
                    
                  }
                } }
            }

          });
          doc.setFontSize(11);
          doc.setTextColor(100);
          doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.othersNames + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
          doc.setTextColor(0, 0, 200);
          doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
          }
          doc.save('SCB_Lista de Ironkeys_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');


        }
      );




  }

  setIronkey(uid) {
    this.ironkey = this.ironkeys1.find(item => item.uid == uid);
    this.openDialog();
  }

  setIronkeyDelete(uid) {
    this.ironkey = this.ironkeys1.find(item => item.uid == uid);
    this.openDialog4();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.ironkey
    });

  }

  openDialog4(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog4, {
      width: '800px',
      height: '250px',
      data: this.ironkey
    });
       
  }

  


  deleteIronkey() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.ironkeysService.deleteIronkey(this.ironkey.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.openSnackBar("Ironkey: "+this.ironkey.serial+", excluido com sucesso!", "OK");
          this.isDisabledt = "";
        } else {
          ;this.openSnackBar("Não é possivel excluir o Ironkey!", "OK");
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

}

@Component({
  selector: 'ironkeys-info-dialog',
  templateUrl: 'ironkeys-info-dialog.html',
})
export class DialogOverviewExampleDialog {

  public displayedColumns: string[] = ['district'];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Ironkey) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'ironkeys-delete-dialog',
  templateUrl: 'ironkeys-delete-dialog.html',
})
export class DialogOverviewExampleDialog4 {

  
  constructor(
    public ironkeysService: IronkeysService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog4>,
    @Inject(MAT_DIALOG_DATA) public data: Ironkey) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.ironkeysService.callMethodOfSecondComponent();
    this.dialogRef.close();
  }

}