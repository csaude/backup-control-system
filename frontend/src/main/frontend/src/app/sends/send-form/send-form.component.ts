/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Send } from '../shared/send';
import { SendsService } from '../shared/sends.service';
import { DistrictsService } from './../../districts/shared/districts.service';
import { District } from './../../districts/shared/district';
import { TransportersService } from './../../transporters/shared/transporters.service';;
import { Transporter } from './../../transporters/shared/transporter';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.css']
})
export class SendFormComponent implements OnInit {
  public form: FormGroup;
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_ODMA: string;
  public ROLE_GDD: string;
  public ROLE_ORMA: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public send: Send = new Send();
  public alldistricts: District[] = [];
  public alltransporters: Transporter[] = [];
  public allsends: Send[] = [];
  public disabled1:boolean;
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
  };
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public sendsService: SendsService,
    public districtsService: DistrictsService,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      send_id: [],
      district: ['', [
        Validators.required]],
      transporter: ['', [
        Validators.required
      ]],
      backup_date: ['', [
        Validators.required
      ]],
      update_finished: [],
      validation_finished: [],
      sync_finished: [],
      cross_dhis2_finished: [],
      cross_idart_finished: [],
      observation: ['', [
        Validators.required
      ]],
      canceled: [],
      canceled_reason: [],
      received: [],
      ik_received: [],
      date_ik_received: []
    });
  }
  ngOnInit() {
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.disabled1=true;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Envio de Backup' : 'Enviar Backup';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        if(this.ROLE_SIS){
          this.alldistricts = user.districts;
        }else{
          this.alldistricts = user.districts.filter(item => item.parentdistrict!=null);
        }
        
            this.alldistricts.sort(function (a, b) {
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
        this.transportersService.getTransporters()
          .subscribe(data => 
            {this.alltransporters = data;}
          ,errot=>{},
          ()=>{
            this.disabled1=false;
          }
          );
  
      } else {
        this.sendsService.getSend(uuid)
          .subscribe(
            send => {
              this.send = send;
              this.alldistricts = user.districts;
              var filtereddistricts = this.alldistricts;
              filtereddistricts = filtereddistricts.filter(item => item.district_id !== this.send.district.district_id );
              if(!this.ROLE_SIS){
                filtereddistricts = filtereddistricts.filter(item => item.parentdistrict!=null);
              }
              
              filtereddistricts.push(this.send.district);
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
              this.transportersService.getTransporters()
                .subscribe(data => {
                  this.alltransporters = data;
                  var filteredtransporters = this.alltransporters;
                  filteredtransporters = filteredtransporters.filter(item => item.transporter_id !== this.send.transporter.transporter_id);
                  filteredtransporters.push(this.send.transporter);
                  this.alltransporters = filteredtransporters.sort(function (a, b) {
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
                },errot=>{},
                ()=>{
                  this.disabled1=false;
                });
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
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.send.uuid) {
      if (new Date(userValue.backup_date) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      }
      else {
        if (userValue.canceled == true && userValue.canceled_reason == null) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else if (userValue.ik_received == true && (userValue.date_ik_received == null)) {
          this.showMsgErr4();
          this.isDisabled = false;
        }
        else {
          userValue.send_id = this.send.send_id;
          userValue.date_created = this.send.date_created;
          userValue.uuid = this.send.uuid;
          userValue.created_by = this.send.created_by;
          userValue.updated_by = user;
         result = this.sendsService.updateSend(userValue);
          result.subscribe(data => this.router.navigate(['sends']));
          this.showMsg();
        }
      }
    } else {
      if (new Date(userValue.backup_date) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      }
      else {
        userValue.created_by = user;
        result = this.sendsService.addSend(userValue);
        result.subscribe(data => this.router.navigate(['sends']));
        this.showMsg();
      }
    }
  }

  showMsg() {
    this.toastService.show('Envio de Backup salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('A Data do Backup não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
  showMsgErr4() {
    this.toastService.show('A Data de Recepção deve ser preenchida!', 2000, 'red', null);
  }
}