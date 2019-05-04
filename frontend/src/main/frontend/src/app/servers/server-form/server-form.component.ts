/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Server } from '../shared/server';
import { ServersService } from '../shared/servers.service';
import { TranslateService } from 'ng2-translate';
import { District } from '../../districts/shared/district';
import { DistrictsService } from '../../districts/shared/districts.service';
import { MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class ServerFormComponent implements OnInit {
    
  public alldistricts: District[] = [];
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public server: Server = new Server();
  public servers: Server[] = [];
  public serial = null;
  public user: any;
  public disabled1: boolean;

  public types = [
    { name: 'CHILD' },
    { name: 'PARENT' }
  ]

     
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public serversService: ServersService,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public districtsService: DistrictsService
  ) {
    this.form = formBuilder.group({
      district: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      type: ['', [
        Validators.required
      ]],
      observation: [],
      canceled: [],
      canceledReason: []
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  ngOnInit() {
    this.disabled1 = true;
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uid'];
      this.title = uuid ? 'Editar Server' : 'Novo Server';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        
        this.districtsService.findDistricts("","","",false,"parent.districtId,districtId,name,uid")
        .subscribe(data => {
          this.alldistricts = data.content.filter(item => item.parent==null);;
        
        },error=>{},
      ()=>{this.disabled1 = false;});

      }
      else {
        this.serversService.findOneServerByUuid(uuid,"canceled,canceledReason,observation,district.name,district.districtId,district.uid,name,type,dateCreated,createdBy.uid,createdBy.userId,uid,serverId")
          .subscribe(
            data => {
              this.server = data;
             
            },
            error => {
              if (error.status == 404) {
                this.router.navigate(['NotFound']);
              }
            }, () => {


              this.districtsService.findDistricts("","","",false,"parent.districtId,districtId,name,uid")
              .subscribe(data => {
                this.alldistricts = data.content.filter(item => item.parent==null);;
                this.alldistricts = this.alldistricts.filter(item => item.districtId !== this.server.district.districtId);
                this.alldistricts.push(this.server.district);
                this.alldistricts =  this.alldistricts.sort(function (a, b) {
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

              },error=>{},
              ()=>{this.disabled1 = false;});



            });
      }
    });
  }

  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    if (this.server.uid) {
      if (userValue.district.districtId==null) {
        this.openSnackBar("Escolha um Distrito!", "OK");
        this.isDisabled = false;
      } else
      if (userValue.canceled == true && userValue.canceledReason == null) {
        this.openSnackBar("Escreva a razão para anular!", "OK");
        this.isDisabled = false;
      } else {

      userValue.serverId = this.server.serverId;
      userValue.dateCreated = this.server.dateCreated;
      userValue.uid = this.server.uid;
      userValue.createdBy = this.server.createdBy;
      userValue.updatedBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };

        result = this.serversService.updateServer(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['servers']);
            this.openSnackBar("Servidor: "+userValue.name+" actualizado com sucesso!", "OK");
          } else {
            this.openSnackBar("Este servidor ja existe!", "OK");
            this.isDisabled = false;
          }
        }, error => {
        },
          () => {
          });
        }  
    } else {
      if (userValue.district.districtId==null) {
        this.openSnackBar("Escolha um Distrito!", "OK");
        this.isDisabled = false;
      } else{
      userValue.createdBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
      result = this.serversService.createServer(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['servers']);
          this.openSnackBar("Servidor: "+userValue.name+" criado com sucesso!", "OK");
        } else {
          this.openSnackBar("Este servidor ja existe!", "OK");
          this.isDisabled = false;
        }
      
      });
    }}
  }
 
}