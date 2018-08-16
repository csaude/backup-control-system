/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServersService } from "./shared/servers.service";
import { Server } from "./shared/server";
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
import { District } from './../districts/shared/district';
import { DistrictsService } from './../districts/shared/districts.service';
import * as myGlobals from '../../globals';
import * as alasql from 'alasql';
import { SyncsService } from "./../syncs/shared/syncs.service";
import { Sync } from "./../syncs/shared/sync";

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  public servers;serversreport: Server[] = [];
  public p: number = 1;
  public total: number = 0;
  public form: FormGroup;
  public server: Server = new Server();
  public isHidden;isHidden2m; isDisabledt: string;
  public name;district;type: string;
  public size: string;
  public alldistricts: District[] = [];
  public canceled: boolean;
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public ROLE_ODMA: string;
  public ROLE_ORMA: string;
  public ROLE_GDD: string;
  public serverssyncinfo;
  public syncs: Sync[] = [];
  public sync: Sync = new Sync();

  public types = [
    { name: 'CHILD' },
    { name: 'PARENT' }
  ]
  
  public user;
  constructor(
    public datepipe: DatePipe, 
    public serversService: ServersService,
    public toastService: MzToastService,
    public translate: TranslateService, 
    public formBuilder: FormBuilder,
    public syncsService: SyncsService,
    public districtsService: DistrictsService) {
      this.form = formBuilder.group({
        name: [],
        district:[],
        canceled:[],
        type:[]
      });
  }
  ngOnInit() {
    this.name = "";
    this.district = "";
    this.size = "";
    this.type = "";
    this.canceled = false;
    this.getPage(1);
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.districtsService.getDistricts()
            .subscribe(data => {
              this.alldistricts = data.filter(item => item.parentdistrict==null);;
            });
  }
  getPage(page: number) {
    this.isHidden = "";
    this.isDisabledt = "disabled";

    this.serversService.getServersSyncInfo()
                        .subscribe(data => {
                          this.serverssyncinfo = data;
                        },
                          error => { },
                          () => {

      this.serversService.getServersPaginated(page, 10, this.district,this.name,this.canceled,this.type)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        var result = data.content;
        var synced = alasql("SELECT [0] AS sync_id,[1] AS server_id,[2] AS server_report,[3] AS duration,[4] AS end_items_to_send,[5] AS end_items_to_receive FROM ?", [this.serverssyncinfo]);
        this.servers= alasql("SELECT * FROM ?result LEFT JOIN ?synced USING server_id ", [result, synced]);
        
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "disabled";
          this.total = 0;
          this.p = 1;
          this.servers = [];
        },
        () => {
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      );
});
    
  }
  search() {
    var userValue = this.form.value;
    if (userValue.name) {
      this.name = userValue.name;
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }

    if (userValue.district) {

      if(userValue.district=="all"){
        this.district ="";
      }else{
        this.district = userValue.district;
      }
      
    }
    else {
      this.district = "";
    }

    if (userValue.canceled) {
      this.canceled = userValue.canceled;
    } else {
      this.canceled = false;
    }

    if (userValue.type) {
      this.type = userValue.type;
      this.type = this.type.split(" ").join("SPACE");
      if (this.type == "all") {
        this.type = "";
      }
    }
    else {
      this.type = "";
    }
   
    this.getPage(1);
  }
  
  setServer(uuid) {
    this.server = this.servers.find(item => item.uuid == uuid);
  }
  deleteServer() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.serversService.deleteServer(this.server.uuid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.getPage(this.p);
          this.showMsg(this.server.name);
          this.isHidden = "hide";
          this.isDisabledt = "";
        } else {
          this.showMsgErr(this.server.name);
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      }
        ,
        error => {
          alert("Não é possivel excluir o Server!");
          this.isHidden = "hide";
          this.isDisabledt = "";
        },
        () => {
        }
      );
  }



  printList() {
    this.isHidden = "";
    this.isDisabledt = "disabled";


    this.serversService.getServersSyncInfo()
    .subscribe(data => {
      this.serverssyncinfo = data;
    },
      error => { },
      () => {


        this.serversService.getServersPaginated(1, 10000000, this.district,this.name,this.canceled,this.type)
      .subscribe(data => {
        var result = data.content;
        var synced = alasql("SELECT [0] AS sync_id,[1] AS server_id,[2] AS server_report,[3] AS duration,[4] AS end_items_to_send,[5] AS end_items_to_receive FROM ?", [this.serverssyncinfo]);
        this.serversreport= alasql("SELECT * FROM ?result LEFT JOIN ?synced USING server_id ", [result, synced]);
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "";
          this.serversreport = [];
        },
        () => {
          this.isHidden = "hide";
          this.isDisabledt = "";

          var user = JSON.parse(window.sessionStorage.getItem('user'));
          var doc = new jsPDF('landscape');
          var totalPagesExp = "{total_pages_count_string}";
          var columns = [
            { title: "Distrito/US", dataKey: "districtname" },
            { title: "Nome do Servidor", dataKey: "name" },
            { title: "Tipo de Servidor", dataKey: "type" },
            { title: "Última Sincronização", dataKey: "server_report" }
          ];
          var listSize = this.serversreport.length;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

           // HEADER
           doc.setFontSize(18);
           doc.text('Lista de Servidores de Sincronização', 14, 22);
           doc.setFontSize(14);
           doc.text(listSize + ' servidores de sincronização encontrados', 14, 45);
           doc.setFontSize(11);
           doc.setTextColor(100);
           var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
           var text = doc.splitTextToSize('Servidores do tipo CHILD são instâncias do OpenMRS utilizadas para recolher dados nas periferias. O PARENT representa uma instância de Servidor Central.', pageWidth - 25, {});
           doc.text(text, 14, 32);

          var pageContent = function (data) {
           
            // FOOTER
            var str = "Página " + data.pageCount;
            if (typeof doc.putTotalPages === 'function') {
              str = str + " de " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 5);
          };
          doc.autoTable(columns, this.serversreport, {
            startY: 50,
            styles: { overflow: 'linebreak' },
            bodyStyles: { valign: 'top' },
            theme: 'grid',
            headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
            addPageContent: pageContent
          });
          doc.setFontSize(11);
          doc.setTextColor(100);
          doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
          doc.setTextColor(0,0,200);
          doc.textWithLink('Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
          }
          doc.save('SCB_Servidores de Sincronização_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');


        }
      );




      });

   
  }

  setSync(id) {
    this.isHidden2m = "";
    this.syncsService.getSyncById(id)
    .subscribe(
      sync => {
        this.sync = sync;
      },error=>{},()=>{this.isHidden2m = "hide";});
  }

  showMsg(server) {
    this.toastService.show('Servidor de sincronização: ' + server + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(server) {
    this.toastService.show('Servidor de sincronização: ' + server + ', não pode ser excluido!', 2000, 'red', null);
  }
}