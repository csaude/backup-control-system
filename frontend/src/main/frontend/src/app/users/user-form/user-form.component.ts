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
import { TranslateService } from 'ng2-translate';
import { MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
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
    public translate: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.form = formBuilder.group({
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.disabled1 = true;
    this.disabled2 = true;
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    var id = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Utilizador' : 'Novo Utilizador';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        this.districtsService.findDistricts("", "", "", false, "fullName,uid,districtId")
          .subscribe(data => {
            this.alldistricts = data.content;
          }, error => { },
            () => {
              this.disabled1 = false;
            }
          );
        this.authoritiesService.findAllAuthorities()
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
        this.usersService.findOneUserByUuid(uuid, "locale,userId,person.gender,person.othersNames,person.surname,person.email,person.phoneNumber,enabled,dateCreated,dateUpdated,creatorId,updaterId,uid,districts.fullName,districts.uid,authorities.description,lastLogin,username,person.personId,person.uid,districts.districtId,creatorId,authorities.authorityId").subscribe(
          user2 => {
            this.user = user2;
            var userdistrict = this.user.districts;
            var userauthority = this.user.authorities;
            this.districtsService.findDistricts("", "", "", false, "fullName,uid,districtId")
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
              }, error => { },
                () => {
                  this.disabled2 = false;
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
    var userLogged = JSON.parse(window.sessionStorage.getItem('user'));

    if (this.user.uid) {
      if (userValue.password_new != null) {
        userValue.password = userValue.password_new;
      }
      userValue.userId = this.user.userId;
      userValue.dateCreated = this.user.dateCreated;
      userValue.uid = this.user.uid;
      userValue.lastLogin = this.user.lastLogin;
      userValue.person = {
        personId: this.user.person.personId,
        uid: this.user.person.uid,
        othersNames: userValue.others_names,
        surname: userValue.surname,
        gender: userValue.gender,
        phoneNumber: userValue.phone_number,
        email: userValue.email
      }

      result = this.usersService.updateUser(userValue, this.user.creatorId, userLogged.userId);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['users']);
          this.openSnackBar("Utilizador: "+ userValue.username+", actualizado com sucesso!", "OK");
        } else {
          this.openSnackBar("Este Utilizador já existe!", "OK");
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
        this.openSnackBar("Escreva a password!", "OK");
        this.isDisabled = false;
      } else {
        var userLogged = JSON.parse(window.sessionStorage.getItem('user'));
        userValue.createdBy = {
          userId: userLogged.userId,
          uid: userLogged.uid
        };
        userValue.enabled=true;
        userValue.person = {
          othersNames: userValue.others_names,
          surname: userValue.surname,
          gender: userValue.gender,
          phoneNumber: userValue.phone_number,
          email: userValue.email
        }

        result = this.usersService.createUser(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['users']);
            this.openSnackBar("Utilizador: "+ userValue.username+", criado com sucesso!", "OK");
          } else {
            this.openSnackBar("Este Utilizador ja existe!", "OK");
            this.isDisabled = false;
          }
        });

      }
    }
  }
  
}