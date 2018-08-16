/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { UsersService } from "./shared/users.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from "./shared/user";
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
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
  constructor(public usersService: UsersService, public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        username: [],
        enabled: []
      });
     }
  ngOnInit() {
    this.username = "";
    this.enabled=true;
    this.getPage(1);
  }
  getPage(page: number) {
    this.isHidden = "";
    this.usersService.getUsersPaginated(page, 10, this.username, this.enabled)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        this.users  = data.content.filter(item => item.user_id != user.user_id);
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
    if (userValue.username) {
      this.username = userValue.username;
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
  deleteUser() {
    this.isHidden = "";
    this.usersService.deleteUser(this.user.uuid)
      .subscribe(data=>{
        if (data.text()=="Success") {
          this.getPage(this.p);
          this.showMsg(this.user.person.others_names + ' ' + this.user.person.surname);
          this.isHidden = "hide";
        }else{
          this.showMsgErr(this.user.person.others_names + ' ' + this.user.person.surname);
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
    this.user = this.users.find(item => item.uuid == uuid);
  }
  showMsg(user) {
    this.toastService.show('Utilizador: ' + user + ', excluido com sucesso!', 4000, 'green', null);
  }
  showMsgErr(user) {
    this.toastService.show('Utilizador: ' + user + ', não pode ser excluido!', 4000, 'red', null);
  }
}