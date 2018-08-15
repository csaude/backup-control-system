/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../shared/user';
import { UsersService } from '../shared/users.service';
import { DistrictsService } from './../../districts/shared/districts.service';
import { District } from './../../districts/shared/district';
import { Person } from './../../persons/shared/person';
import { AuthoritiesService } from './../../authorities/shared/authorities.service';
import { Authority } from './../../authorities/shared/authority';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isHidden2: string;
  public isDisabled: boolean;
  public user: User = new User();
  public person: Person = new Person();
  public users: User[] = [];
  public alldistricts: District[] = [];
  public allauthorities: Authority[] = [];
  public ROLE_SIS: string;
  public disabled1; disabled2: boolean;
  public genders = [
    { name: 'M', description: 'Masculino' },
    { name: 'F', description: 'Feminino' }
  ];
  public languages = [
    { name: 'pt', description: 'Português' },
    { name: 'en', description: 'English' }
  ];
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public usersService: UsersService,
    public districtsService: DistrictsService,
    public authoritiesService: AuthoritiesService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      user_id: [],
      others_names: ['', [
        Validators.required
      ]],
      surname: ['', [
        Validators.required
      ]],
      gender: ['', [
        Validators.required
      ]],
      email: [],
      phone_number: [],
      username: ['', [
        Validators.required
      ]],
      password: [],
      districts: [],
      person: [],
      password_new: [],
      enabled: [],
      authorities: ['', [
        Validators.required
      ]],
      locale: ['', [
        Validators.required
      ]]
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.disabled1 = true;
    this.disabled2 = true;
    var user = JSON.parse(window.localStorage.getItem('user'));
    this.ROLE_SIS = window.localStorage.getItem('ROLE_SIS');
    var id = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Utilizador' : 'Novo Utilizador';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        this.districtsService.getDistricts()
          .subscribe(data => {
            this.alldistricts = data;
          }, error => { },
            () => {
              this.disabled1 = false;
            }
          );
        this.authoritiesService.getAuthorities()
          .subscribe(data => {
            this.allauthorities = data;
          }, error => { },
            () => {
              this.disabled2 = false;
            }
          );
        return;
      } else {
        this.isHidden2 = 'hide';
        this.usersService.getUserByUuid(uuid).subscribe(
          user2 => {
            this.user = user2;
            var userdistrict = this.user.districts;
            var userauthority = this.user.authorities;
            this.districtsService.getDistricts()
              .subscribe(data => {
                this.alldistricts = data;
                var filtereddistricts = this.alldistricts;
                for (let i of userdistrict) {
                  filtereddistricts = filtereddistricts.filter(item => item.district_id !== i.district_id);
                }
                for (let i of userdistrict) {
                  filtereddistricts.push(i);
                }
                this.alldistricts = filtereddistricts.sort(function (a, b) {
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
              }, error => { },
                () => {
                  this.disabled2 = false;
                });
            this.authoritiesService.getAuthorities()
              .subscribe(data => {
                this.allauthorities = data;
                var filteredauthorities = this.allauthorities;
                for (let i of userauthority) {
                  filteredauthorities = filteredauthorities.filter(item => item.authority_id !== i.authority_id);
                }
                for (let i of userauthority) {
                  filteredauthorities.push(i);
                }
                this.allauthorities = filteredauthorities.sort(function (a, b) {
                  var nameA = a.description.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.description.toUpperCase(); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              }, error => { },
                () => {
                  this.disabled1 = false;
                },
            );
          },
          response => {
            if (response.status == 404) {
              this.router.navigate(['NotFound']);
            }
          });
      }
    });
  }
  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    var userLogged = JSON.parse(window.localStorage.getItem('user'));
    console.log(userValue)
    if (this.user.uuid) {
      if (userValue.password_new != null) {
        userValue.password = userValue.password_new;
      }
      userValue.date_created = this.user.date_created;
      userValue.uuid = this.user.uuid;
      userValue.last_login = this.user.last_login;
      result = this.usersService.updateUser(userValue, this.user.creatorid, userLogged.user_id);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['users']);
          this.showMsg(userValue.username);
        } else {
          this.showMsgErr(userValue.username);
          this.isDisabled = false;
        }
      },
        error => {
        },
        () => {
        }
      );
    } else {
      if (!userValue.password) {
        this.showMsgErr2();
        this.isDisabled = false;
      } else {
        this.usersService.getUserByUuid(userLogged.uuid).subscribe(
          userReturned => {
            userValue.created_by = userReturned;
            result = this.usersService.addUser(userValue);
            result.subscribe(data => {
              if (data.text() == "Success") {
                this.router.navigate(['users']);
                this.showMsg(userValue.username);
              } else {
                this.showMsgErr(userValue.username);
                this.isDisabled = false;
              }
            });
          });
      }
    }
  }
  showMsg(user) {
    this.toastService.show('Utilizador: ' + user + ', salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr(user) {
    this.toastService.show('Este Utilizador ja existe!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('Escreva uma password!', 2000, 'red', null);
  }
}