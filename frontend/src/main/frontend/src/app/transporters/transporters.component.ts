/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { TransportersService } from "./shared/transporters.service";
import { Transporter } from "./shared/transporter";
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
  public transporters;transporters1: Transporter[] = [];

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

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['name','role','phone','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;
     
  constructor(
    public transportersService: TransportersService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.form = formBuilder.group({
      role: [],
      canceled: []
    });

    this.transportersService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.deleteTransporter();
      }
    });
  }
  ngOnInit() {
    this.name = "";
    this.role = "";
    this.page=0;
    this.pageSize=10;
    this.canceled = false;
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.name = this.nameValueControl.value;
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
    this.transportersService.findTransporters(this.page+1, this.pageSize, this.name, this.role, this.canceled,"createdBy.phoneNumber,updatedBy.phoneNumber,name,role,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,canceled,canceledBy.personName,canceledReason,phoneNumber,dateCanceled")
      .subscribe(data => {
        this.total = data.totalElements;
        this.transporters1 = data.content;
        this.transporters = new MatTableDataSource(this.transporters1);
        this.transporters.sort = this.sort;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.transporters = [];
          this.transporters1 = [];
        },
        () => {
          this.isHidden = "hide";
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
    this.page=0;
    this.getPage(1);
  }


  deleteTransporter() {
    this.isHidden = "";
    this.transportersService.deleteTransporter(this.transporter.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.openSnackBar("Transportador: "+this.transporter.name+", excluido com sucesso!", "OK");
        } else {
          this.openSnackBar("Não é possivel excluir o Transportador!", "OK");
          this.isHidden = "hide";
        }
      },
        error => {
        }
      );
  }
  setTransporter(uid) {
    this.transporter = this.transporters1.find(item => item.uid == uid);
    this.openDialog();
  }

  setTransporterDelete(uid) {
    this.transporter = this.transporters1.find(item => item.uid == uid);
    this.openDialog4();
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.transporter
    });

  }

  openDialog4(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog4, {
      width: '800px',
      height: '250px',
      data: this.transporter
    });
       
  }

}

@Component({
  selector: 'transporters-info-dialog',
  templateUrl: 'transporters-info-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Transporter) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'transporters-delete-dialog',
  templateUrl: 'transporters-delete-dialog.html',
})
export class DialogOverviewExampleDialog4 {

  
  constructor(
    public transportersService: TransportersService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog4>,
    @Inject(MAT_DIALOG_DATA) public data: Transporter) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.transportersService.callMethodOfSecondComponent();
    this.dialogRef.close();
  }

}