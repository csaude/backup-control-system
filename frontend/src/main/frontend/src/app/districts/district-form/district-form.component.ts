/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { District } from '../shared/district';
import { DistrictsService } from '../shared/districts.service';
import { IronkeysService } from './../../ironkeys/shared/ironkeys.service';;
import { Ironkey } from './../../ironkeys/shared/ironkey';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-district-form',
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.css']
})

export class DistrictFormComponent implements OnInit {
  public provinces = [
    { name: 'Cabo Delgado' },
    { name: 'Gaza' },
    { name: 'Inhambane' },
    { name: 'Maníca' },
    { name: 'Maputo Cidade' },
    { name: 'Maputo Província' },
    { name: 'Nampula' },
    { name: 'Niassa' },
    { name: 'Sofala' },
    { name: 'Tete' },
    { name: 'Zambézia' },
    { name: 'Outra' }
  ]
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public response: string;
  public district: District = new District();
  public alldistricts: District[] = [];
  public allironkeys: Ironkey[] = [];
  public user: Object[] = [];
  public disabled1: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public districtsService: DistrictsService,
    public ironkeysService: IronkeysService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      district_id: [],
      province: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      instance_url: [],
      instance_username: [],
      instance_password: [],
      ironkeys: [],
      canceled: [],
      canceled_reason: [],
      parent:[]
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.disabled1 = true;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    var id = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Distrito' : 'Novo Distrito';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        this.districtsService.getDistricts()
            .subscribe(data => {
              this.alldistricts = data;
            });
        this.ironkeysService.getIronkeys()
          .subscribe(data => {this.allironkeys = data},error=>{},
            ()=>{
              this.disabled1 = false;
            });
        return;
      } else {
        

        this.districtsService.getDistrictByUuid(uuid).subscribe(
          district => {
            this.district = district;
            var districtik = district.ironkeysDistrict;
            this.ironkeysService.getIronkeys()
              .subscribe(data => {
                this.allironkeys = data;
                var filteredironkeys = this.allironkeys;
                for (let i of districtik) {
                  filteredironkeys = filteredironkeys.filter(item => item.ironkey_id !== i.ironkey_id);
                }
                for (let i of districtik) {
                  filteredironkeys.push(i);
                }
                this.allironkeys = filteredironkeys.sort(function (a, b) {
                  var nameA = a.serial.toUpperCase();
                  var nameB = b.serial.toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              },error=>{},
              ()=>{

                this.districtsService.getDistricts()
              .subscribe(data => {
                this.alldistricts = data;
                if(this.district.parentdistrict!=null){
                this.alldistricts = this.alldistricts.filter(item => item.district_id !== this.district.parentdistrict.district_id);
                this.alldistricts.push(this.district.parentdistrict);
                }
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


                
              }
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
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    userValue.districts = userValue.districtsIronkeys;
    if (userValue.district_id) {
      userValue.district_id = this.district.district_id;
      userValue.date_created = this.district.date_created;
      userValue.uuid = this.district.uuid;
      userValue.created_by = this.district.created_by;
      userValue.updated_by = this.user;
      result = this.districtsService.updateDistrict(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['districts']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      });
    } else {
      userValue.created_by = user;
      result = this.districtsService.addDistrict(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['districts']);
          this.showMsg(userValue.name);
        } else {
          this.showMsgErr();
          this.isDisabled = false;
        }
      });
    }
  }

  showMsg(district) {
    this.toastService.show('Distrito: ' + district + ', salvo com sucesso!', 4000, 'green', null);
  }

  showMsgErr() {
    this.toastService.show('Este Distrito ja existe!', 4000, 'red', null);
  }

  
}