/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { UsersService } from "./shared/users.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from "./shared/user";
import { MzToastService } from 'ngx-materialize';
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
* @author Damasceno Lopes
*/
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public isHidden: string;
  public uuid: string;
  public user: User = new User();
  public p: number = 1;
  public total: number= 0;
  public form: FormGroup;
  public username: string;
  public enabled: boolean;
  public enableds: boolean=true;
  
  public next;previous: number=0;
  public first; last; range: string;

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
     
  constructor(public usersService: UsersService, public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        enabled: []
      });
     }
  ngOnInit() {
    this.username = "";
    this.enabled=true;
    this.pageSize=10
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
    .debounceTime(600)
    .subscribe(newValue => {
      this.username = this.nameValueControl.value;
      this.search();
    });

  }
  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";
    this.usersService.findUsers(page, this.pageSize, this.username, this.enabled,"person.gender,person.othersNames,person.surname,person.email,person.phoneNumber,enabled,dateCreated,dateUpdated,creatorName,updaterName,creatorId,updaterId,uid,districts.fullName,districts.uid,authorities.description,lastLogin,username")
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        this.users  = data.content.filter(item => item.username != user.username);
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
          this.users = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
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
    this.getPage(1);
  }

  searchSize(){
    this.getPage(1);
  }

  deleteUser() {
    
    this.isHidden = "";
    this.usersService.deleteUser(this.user.uid)
      .subscribe(data=>{
        if (data.text()=="Success") {
          this.getPage(this.p);
          this.showMsg(this.user.username);
          this.isHidden = "hide";
        }else{
          this.showMsgErr(this.user.username);
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
    this.user = this.users.find(item => item.uid == uuid);
  }
  showMsg(user) {
    this.toastService.show('Utilizador: ' + user + ', excluido com sucesso!', 4000, 'green', null);
  }
  showMsgErr(user) {
    this.toastService.show('Utilizador: ' + user + ', não pode ser excluido!', 4000, 'red', null);
  }
}