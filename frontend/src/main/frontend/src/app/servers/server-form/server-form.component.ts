/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Server } from '../shared/server';
import { ServersService } from '../shared/servers.service';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
import { District } from '../../districts/shared/district';
import { DistrictsService } from '../../districts/shared/districts.service';

@Component({
  selector: 'app-server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.css']
})
export class ServerFormComponent implements OnInit {
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
  };
  
  public alldistricts: District[] = [];
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public server: Server = new Server();
  public servers: Server[] = [];
  public serial = null;
  public user: Object[] = [];
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
    public toastService: MzToastService,
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
      canceled_reason: []
    });
  }
  ngOnInit() {
    this.disabled1 = true;
    this.isDisabled = false;
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Server' : 'Novo Server';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        
        this.districtsService.getDistricts()
        .subscribe(data => {
          this.alldistricts = data;
        
        },error=>{},
      ()=>{this.disabled1 = false;});

      }
      else {
        this.serversService.getServerByUuid(uuid)
          .subscribe(
            server => {
              this.server = server;
             
            },
            error => {
              if (error.status == 404) {
                this.router.navigate(['NotFound']);
              }
            }, () => {


              this.districtsService.getDistricts()
              .subscribe(data => {
                this.alldistricts = data;
                this.alldistricts = this.alldistricts.filter(item => item.district_id !== this.server.district.district_id);
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
    if (this.server.uuid) {
      if (userValue.canceled == true && userValue.canceled_reason == null) {
        this.showMsgErr2();
        this.isDisabled = false;
      } else {

      userValue.server_id = this.server.server_id;
      userValue.date_created = this.server.date_created;
      userValue.uuid = this.server.uuid;
      userValue.created_by = this.server.created_by;
      userValue.updated_by = this.user;
     
        result = this.serversService.updateServer(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['servers']);
            this.showMsg(userValue.name);
          } else {
            this.showMsgErr(userValue.name);
            this.isDisabled = false;
          }
        }, error => {
        },
          () => {
          });
        }  
    } else {
      userValue.created_by = this.user;
      result = this.serversService.addServer(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['servers']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr(userValue.name);
          this.isDisabled = false;
        }
      });
    }
  }
  showMsg(server) {
    this.toastService.show('Servidor: ' + server + ', salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr(server) {
    this.toastService.show('Este Servidor ja existe!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
}