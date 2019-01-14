/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
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
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-userdetails-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class UserDetailsFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isHidden2: string;
  public isDisabled: boolean;
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_ODMA: string;
  public ROLE_GDD: string;
  public ROLE_ORMA: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public user: User = new User();
  public person: Person = new Person();
  public users: User[] = [];
  public alldistricts: District[] = [];
  public allauthorities: Authority[] = [];
  public genders = [
    { name: 'M', description: 'Masculino' },
    { name: 'F', description: 'Feminino' }
  ];
  public languages = [
    { name: 'pt', description: 'Português' },
    { name: 'en', description: 'English' }
  ];
  constructor(
    formBuilder: FormBuilder,
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
      notification: [],
      locale: ['', [
        Validators.required
      ]]
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Meu Perfil' : 'Novo Utilizador';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
       
        return;
      } else {
        this.isHidden2 = 'hide';
        this.usersService.findOneUserByUuid(uuid,"creatorName,updaterName,locale,userId,person.gender,person.othersNames,person.surname,person.email,person.phoneNumber,enabled,dateCreated,dateUpdated,creatorId,updaterId,uid,districts.fullName,districts.uid,authorities.description,lastLogin,username,person.personId,person.uid,districts.districtId,creatorId,authorities.authorityId,notification").subscribe(
          user2 => {
            this.user = user2;
            var userdistrict = this.user.districts;
            var userauthority = this.user.authorities;
            this.districtsService.findDistricts("","","",false,"fullName,uid,districtId")
              .subscribe(data => {
                  this.alldistricts = data.content;
                var filtereddistricts = this.alldistricts;
                for (let i of userdistrict) {
                  filtereddistricts = filtereddistricts.filter(item => item.districtId !== i.districtId);
                }
                for (let i of userdistrict) {
                  filtereddistricts.push(i);
                }
                this.alldistricts = filtereddistricts.sort(function (a, b) {
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
              });
            this.authoritiesService.findAllAuthorities()
              .subscribe(data => {
                  this.allauthorities = data;
                var filteredauthorities = this.allauthorities;
                for (let i of userauthority) {
                  filteredauthorities = filteredauthorities.filter(item => item.authorityId !== i.authorityId);
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
              });
          },
          error => {
            if (error.status == 404) {
              this.router.navigate(['NotFound']);
            }
          },
          () => {
            this.isHidden = "hide";
          }
        );
      }
    });
  }
  save() {
    this.isDisabled = true;
    this.isHidden = "";
    var result, userValue = this.form.value;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.user.userId) {
        if (userValue.password_new != null) {
          userValue.password = userValue.password_new;
        }

        userValue.userId = this.user.userId;
        userValue.dateCreated = this.user.dateCreated;
        userValue.uid = this.user.uid;
        userValue.lastLogin = this.user.lastLogin;
        userValue.enabled=true;
        userValue.person = {
          personId: this.user.person.personId,
          uid: this.user.person.uid,
          othersNames: userValue.others_names,
          surname: userValue.surname,
          gender: userValue.gender,
          phoneNumber: userValue.phone_number,
          email: userValue.email
        }

        result = this.usersService.updateUser(userValue, this.user.creatorId, user.userId);
        result.subscribe(data => {
        },
          error => {
          },
          () => {
            this.showMsg(userValue.username);
            window.sessionStorage.removeItem("user");

            if (userValue.password_new != null) {
              window.sessionStorage.removeItem("password");
              var wordArray = CryptoJS.enc.Utf8.parse(userValue.password_new);
              var base64 = CryptoJS.enc.Base64.stringify(wordArray);
              window.sessionStorage.setItem('password', base64);
            }
            
            window.sessionStorage.setItem('user', JSON.stringify(userValue));
           
            this.translate.use(userValue.locale);
            this.isDisabled = false;
            this.isHidden = "hide";
          }
        );
    } else {
    }
  }
  showMsg(user) {
    this.toastService.show('Utilizador: ' + user + ', salvo com sucesso!', 4000, 'green', null);
  }
  showMsgErr(user) {
    this.toastService.show('Username: ' + user + ' ja esta a ser utilizado!', 4000, 'red', null);
  }
}