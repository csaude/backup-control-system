import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { UsersService } from "./shared/users.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { User } from "./shared/user";
import { TranslateService } from 'ng2-translate';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class UsersComponent implements OnInit {
  public users;users1: User[] = [];
  public isHidden: string;
  public uuid: string;
  public user: User = new User();
  public total: number= 0;
  public form: FormGroup;
  public username: string;
  public enabled;enableds: boolean;

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['name','username','email','phone','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;
     
  constructor(public usersService: UsersService, 
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        enabled: []
      });

      this.usersService.invokeEvent.subscribe(value => {
        if (value === 'someVal') {
          this.deleteUser();
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
    this.username = "";
    this.enabled=true;
    this.enableds=true;
    this.page=0;
    this.pageSize=10;
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
    .debounceTime(600)
    .subscribe(newValue => {
      this.username = this.nameValueControl.value;
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
    this.usersService.findUsers(this.page+1, this.pageSize, this.username, this.enabled,"person.gender,person.othersNames,person.surname,person.email,person.phoneNumber,enabled,dateCreated,dateUpdated,creatorName,updaterName,creatorId,updaterId,uid,districts.fullName,districts.uid,authorities.description,lastLogin,username")
      .subscribe(data => {
        this.total = data.totalElements;
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        this.users1  = data.content.filter(item => item.username != user.username);
        this.users = new MatTableDataSource(this.users1);
        this.users.sort = this.sort;
        
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.users = [];
          this.users1 = [];
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
    if (this.username) {
      this.username = this.username.split(" ").join("SPACE");
    }
    else {
      this.username = "";
    }
    if (userValue.enabled) {
      this.enabled = userValue.enabled;
    } else {
      this.enabled = false;
    }
    this.page=0;
    this.getPage(1);
  }

  deleteUser() {
    
    this.isHidden = "";
    this.usersService.deleteUser(this.user.uid)
      .subscribe(data=>{
        if (data.text()=="Success") {
          this.search();
          this.openSnackBar("Utilizador: "+this.user.username+", excluido com sucesso!", "OK");
          this.isHidden = "hide";
        }else{
          this.openSnackBar("Não é possivel excluir o Transportador!", "OK");
          this.isHidden = "hide";
        }
      },
        error => {
        },
        () => {
        }
      );
  }
  setUser(uuid) {
    this.user = this.users1.find(item => item.uid == uuid);
    this.openDialog();
  }

  setUserDelete(uid) {
    this.user = this.users1.find(item => item.uid == uid);
    this.openDialog4();
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.user
    });

  }

  openDialog4(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog4, {
      width: '800px',
      height: '250px',
      data: this.user
    });
       
  }
  
}

@Component({
  selector: 'users-info-dialog',
  templateUrl: 'users-info-dialog.html',
})
export class DialogOverviewExampleDialog {

  public displayedColumns1: string[] = ['role'];
  public displayedColumns2: string[] = ['district'];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'users-delete-dialog',
  templateUrl: 'users-delete-dialog.html',
})
export class DialogOverviewExampleDialog4 {

  
  constructor(
    public usersService: UsersService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog4>,
    @Inject(MAT_DIALOG_DATA) public data: User) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.usersService.callMethodOfSecondComponent();
    this.dialogRef.close();
  }

}