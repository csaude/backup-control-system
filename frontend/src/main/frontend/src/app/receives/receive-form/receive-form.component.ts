/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Receive } from '../shared/receive';
import { ReceivesService } from '../shared/receives.service';
import { SendsService } from "../../sends/shared/sends.service";
import { Send } from "../../sends/shared/send";
import { TransportersService } from './../../transporters/shared/transporters.service';;
import { Transporter } from './../../transporters/shared/transporter';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-receive-form',
  templateUrl: './receive-form.component.html',
  styleUrls: ['./receive-form.component.css']
})
export class ReceiveFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public receive: Receive = new Receive();
  public send: Send = new Send();
  public openFunctionCallback; closeFunctionCallback;
  public alltransporters: Transporter[] = [];
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
  };
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public receivesService: ReceivesService,
    public sendsService: SendsService,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public datepipe: DatePipe
  ) {
    this.form = formBuilder.group({
      receive_id: [],
      send: [],
      receive_date: ['', [
        Validators.required
      ]],
      observation: [],
      ik_returned: [],
      date_ik_returned: [],
      date_restored: [],
      restored: [],
      transporter: [],
      canceled: [],
      canceled_reason: []
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Receber Backup' : 'Editar Recepção de Backup';
      if (uuid) {
        this.isHidden = uuid ? 'hide' : 'hide';
        this.sendsService.getSend(uuid)
          .subscribe(send => {
            this.send = send;
          });
        this.transportersService.getTransporters()
          .subscribe(data => {
            this.alltransporters = data;
          });
      } else {
        //Edit here
        var uuidr = params['uuidr'];
        this.receivesService.getReceive(uuidr)
          .subscribe(receive => {
            this.receive = receive;
            if (this.receive.transporter != null) {
              this.transportersService.getTransporters()
                .subscribe(data => {
                  this.alltransporters = data;
                  var filteredtransporters = this.alltransporters;
                  filteredtransporters = filteredtransporters.filter(item => item.transporter_id !== this.receive.transporter.transporter_id);
                  filteredtransporters.push(this.receive.transporter);
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
                });
            }
            else {
              this.transportersService.getTransporters()
                .subscribe(data => {
                  this.alltransporters = data;
                });
            }
          });
      }
    });
  }
  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (userValue.receive_id) {
      if (new Date(userValue.receive_date) > new Date()||new Date(userValue.date_ik_returned)> new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      } else
        if (userValue.ik_returned == true && (userValue.transporter == null || userValue.date_ik_returned == null)) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.date_restored == null)) {
            this.showMsgErr4();
            this.isDisabled = false;
          }
          else
            if (new Date(userValue.date_restored) > new Date()) {
              this.showMsgErr2();
              this.isDisabled = false;
            }
            else
              if (this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_restored, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_ik_returned, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_ik_returned, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_restored, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd')) {
                this.showMsgErrDate();
                this.isDisabled = false;
              }
              else {
                if (userValue.canceled == true && userValue.canceled_reason == null) {
                  this.showMsgErr3n();
                  this.isDisabled = false;
                } else {
                  userValue.receive_id = this.receive.receive_id;
                  userValue.date_created = this.receive.date_created;
                  userValue.uuid = this.receive.uuid;
                  userValue.created_by = this.receive.created_by;
                  userValue.updated_by = user;

                  result = this.receivesService.updateReceive(userValue);
                  result.subscribe(data => this.router.navigate(['receives']));
                }
              }
    } else {
      if (new Date(userValue.receive_date) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      } else
        if (userValue.ik_returned == true && (userValue.transporter == null || userValue.date_ik_returned == null)) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.date_restored == null)) {
            this.showMsgErr4();
            this.isDisabled = false;
          }
          else
            if (new Date(userValue.date_restored) > new Date()) {
              this.showMsgErr2();
              this.isDisabled = false;
            }
            else
              if (this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_restored, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_ik_returned, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backup_date), 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_ik_returned, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd') || this.datepipe.transform(userValue.date_restored, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receive_date, 'yyyy-MM-dd')) {
                this.showMsgErrDate();
                this.isDisabled = false;
              }
              else {
                if (this.send.received == true) {
                  this.router.navigate(['receives']);
                } else {
                  
                  userValue.created_by = user;
                  result = this.receivesService.addReceive(userValue);
                  result.subscribe(data => this.router.navigate(['receives']));
                }

              }
    }
  }
  showMsgErr() {
    this.toastService.show('A Data do Recepção ou Devolução não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('A Data de Restauração não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('O transportador e data de devolução do Iron Key devem ser preenchidos!', 2000, 'red', null);
  }
  showMsgErr4() {
    this.toastService.show('A Data de Restauração deve ser preenchida!', 2000, 'red', null);
  }
  showMsgErrDate() {
    this.toastService.show('Verifique as datas!', 2000, 'red', null);
  }
  showMsgErr3n() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
}
