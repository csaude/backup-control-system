/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Transporter } from '../shared/transporter';
import { TransportersService } from '../shared/transporters.service';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-transporter-form',
  templateUrl: './transporter-form.component.html',
  styleUrls: ['./transporter-form.component.css']
})
export class TransporterFormComponent implements OnInit {
  public roles = [
    { name: 'Gestor de Dados' },
    { name: 'Gestor de M&A' },
    { name: 'Motorista' },
    { name: 'Oficial Distrital de M&A' },
    { name: 'Oficial Regional de M&A' },
    { name: 'Oficial de SIS' },
    { name: 'Oficial de Análise' },
    { name: 'Outra' },
  ]
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public transporter: Transporter = new Transporter();
  public user: Object[] = [];
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      role: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      phone_number: [],
      canceled: [],
      canceled_reason: []
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Transportador' : 'Novo Transportador';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        return;
      } else {
        this.transportersService.getTransporterByUuid(uuid)
          .subscribe(
            transporter => this.transporter = transporter,
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
    if (this.transporter.uuid) {
      if (userValue.canceled == true && userValue.canceled_reason == null) {
        this.showMsgErr2();
        this.isDisabled = false;
      } else {
        userValue.transporter_id = this.transporter.transporter_id;
        userValue.date_created = this.transporter.date_created;
        userValue.uuid = this.transporter.uuid;
        userValue.created_by = this.transporter.created_by;
        userValue.updated_by = this.user;
        result = this.transportersService.updateTransporter(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['transporters']);
            this.showMsg(userValue.name);
          } else {
            this.showMsgErr();
            this.isDisabled = false;
          }
        });
      }
    } else {
      userValue.created_by = this.user;
      result = this.transportersService.addTransporter(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['transporters']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      }
      );
    }
  }
  showMsg(transporter) {
    this.toastService.show('Transportador: ' + transporter + ', salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('Transportador com estas propriedades ja existe!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
}