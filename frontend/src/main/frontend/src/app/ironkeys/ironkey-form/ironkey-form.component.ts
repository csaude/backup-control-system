/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Ironkey } from '../shared/ironkey';
import { IronkeysService } from '../shared/ironkeys.service';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-ironkey-form',
  templateUrl: './ironkey-form.component.html',
  styleUrls: ['./ironkey-form.component.css']
})
export class IronkeyFormComponent implements OnInit {
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
  };
  public sizes = [
    { id: 1, name: '1 GB' },
    { id: 2, name: '2 GB' },
    { id: 4, name: '4 GB' },
    { id: 8, name: '8 GB' },
    { id: 16, name: '16 GB' },
    { id: 32, name: '32 GB' },
    { id: 64, name: '64 GB' },
    { id: 128, name: '128 GB' },
    { id: 256, name: '256 GB' },
    { id: 500, name: '500 GB' },
    { id: 1000, name: '1 TB' },
    { id: 0, name: 'Outro' }
  ];
  public status = [
    { name: "Activado" },
    { name: "Desactivado" },
    { name: "Perdido" },
    { name: "Com Problema" },
    { name: "Outro" }
  ];
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public ironkey: Ironkey = new Ironkey();
  public ironkeys: Ironkey[] = [];
  public serial = null;
  public user: Object[] = [];
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public ironkeysService: IronkeysService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      serial: ['', [
        Validators.required
      ]],
      size: ['', [
        Validators.required
      ]],
      status: ['', [
        Validators.required
      ]],
      version: ['', [
        Validators.required
      ]],
      observation: [],
      date_purchased: [],
      selecteddistricts: [],
      ironkeydistricts: []
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Ironkey' : 'Novo Ironkey';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        return;
      }
      else {
        this.ironkeysService.getIronkeyByUuid(uuid)
          .subscribe(
            ironkey => {
              this.ironkey = ironkey;
              this.serial = ironkey.serial;
            },
            error => {
              if (error.status == 404) {
                this.router.navigate(['NotFound']);
              }
            }, () => {
            });
      }
    });
  }

  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    if (this.ironkey.uuid) {
      userValue.ironkey_id = this.ironkey.ironkey_id;
      userValue.date_created = this.ironkey.date_created;
      userValue.uuid = this.ironkey.uuid;
      userValue.created_by = this.ironkey.created_by;
      userValue.updated_by = this.user;
      if (this.serial == userValue.serial) {
        result = this.ironkeysService.updateIronkey(userValue);
        result.subscribe(data => { this.router.navigate(['ironkeys']); }
          , error => {
          },
          () => {
            this.showMsg(userValue.serial);
          }
        );
      }
      else {
        result = this.ironkeysService.updateIronkey(userValue);
        result.subscribe(data => {
          if (data.text() == "Success") {
            this.router.navigate(['ironkeys']);
            this.showMsg(userValue.serial);
          } else {
            this.showMsgErr(userValue.serial);
            this.isDisabled = false;
          }
        }, error => {
        },
          () => {
          });
      }
    } else {
      userValue.created_by = this.user;
      result = this.ironkeysService.addIronkey(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['ironkeys']);
          this.showMsg(userValue.serial);
        } else {
          this.showMsgErr(userValue.serial);
          this.isDisabled = false;
        }
      });
    }
  }
  showMsg(ironkey) {
    this.toastService.show('Iron Key: ' + ironkey + ', salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr(ironkey) {
    this.toastService.show('Este Ironkey ja existe!', 2000, 'red', null);
  }
}