import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DistrictsService } from "../districts/shared/districts.service";
import { ServersService } from "../servers/shared/servers.service";
import { TranslateService } from 'ng2-translate';
import { ResourcesService } from "./../resources/shared/resources.service";
import * as alasql from 'alasql';
import { District } from '../districts/shared/district';
import { Server } from '../servers/shared/server';

import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class HomeComponent implements OnInit {

  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;
  public isAuth;isHidden: boolean;
  public isAuthHq: boolean;
  public chart1; chart2; chart3; chart4; chart5; chart6; chart7; chart8; chart9; chart10; chart11: boolean;
  public user;
  //Chart1
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [];
  public alldistricts;alldistricts2: District[] = [];
  public allservers;allservers2;allservers3;allservers4: Server[] = [];
  public prevMonth= new Date(new Date().getFullYear(),new Date().getMonth()-2,1);
  public currentMonth= new Date(new Date().getFullYear(),new Date().getMonth()-1,1);


  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de backups efectuados no mês anterior recebidos no SIS (FY' +this.datepipe.transform(this.prevMonth,'yy')+this.datepipe.transform(this.prevMonth,'MM')+")",
      display: true
    },legend: {
      position: 'bottom'
  },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked:true
      }]
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0&&context.dataset.label=='Backup enviado e recebido no SIS';
       }
      }
    }
    
  };
  public myColors = [
    {
      backgroundColor: 'rgba(54, 162, 235, .8)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    }
  ];

  public myColors2: Array<any>= [
    {
      backgroundColor: 'rgba(54, 162, 235, .8)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    },

    {
      backgroundColor: 'rgba(255, 99, 132, .8)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    },

  ];

  public myColors2s: Array<any>= [
    {
      backgroundColor: 'rgba(54, 162, 235, .8)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    },
    
    {
      backgroundColor: 'rgba(255,165,0, .8)',
      borderColor: 'rgb(255,165,0)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    }
,
    {
      backgroundColor: 'rgba(255, 99, 132, .8)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .10)'
    }

  ];

  public myColors3: Array<any>= [
    {
      backgroundColor: ['rgba(54, 162, 235, .8)','rgba(255, 99, 132, .8)']
    }

  ];

  //Chart2
  public barChartLabels2: string[] = [];
  public barChartType2: string = 'bar';
  public barChartLegend2: boolean = true;
  public barChartData2: any[] = [];
  public barChartOptions2: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
  },
    title: {
      text: 'Nº de backups efectuados neste mês recebidos no SIS (FY' +this.datepipe.transform(this.currentMonth,'yy')+this.datepipe.transform(this.currentMonth,'MM')+")" ,
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked:true
      }]
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0&&context.dataset.label=='Backup enviado e recebido no SIS';
       }
      }
    }
  };
  //Chart3
  public lineChartLabels: string[] = [];
  public lineChartType: string = 'line';
  public lineChartLegend: boolean = true;
  public lineChartData: any[] = [];
  //Line Chart
  public lineChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
  },
    title: {
      text: 'Nº de distritos que registaram envio de backups nos últimos 12 meses',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        }
      }]
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        }
      }
    }
  };


  //Chart4
  public barChartLabels4: string[] = [];
  public barChartType4: string = 'bar';
  public barChartLegend4: boolean = true;
  public barChartData4: any[] = [];
  public barChartOptions4: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,legend: {
      position: 'bottom',
  },
    title: {
      text: 'Nº de registos de sincronização OpenMRS da semana anterior',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        },
        stacked: true
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked: true
      }]
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0&&(context.dataset.label=='Sincronização registada'||context.dataset.label=='Ocorrência registada');
       }
      }
    }
  };

  //Chart5
  public barChartLabels5: string[] = [];
  public barChartType5: string = 'bar';
  public barChartLegend5: boolean = true;
  public barChartData5: any[] = [];
  public barChartOptions5: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
  },
    title: {
      text: 'Nº de registos de sincronização OpenMRS desta semana',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        },
        stacked: true
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked: true
      }]
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0&&(context.dataset.label=='Sincronização registada'||context.dataset.label=='Ocorrência registada');
       }
      }
    }
  };

  //Chart6
  public pieChartType6: string = 'pie';
  public pieOptions6: any = {
    title: {
      text: 'Nº de ocorrências de sincronização OpenMRS registadas na semana anterior',
      display: true
    },
    legend: {
      display: true,
      position:'bottom'
    },
    tooltips: {
      enabled: true
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0;
       }
      }
    }
  };
  public pieChartLabels6: string[] = [];
  public pieChartData6: any[] = [];

  //Chart7
  public pieChartType7: string = 'pie';
  public pieOptions7: any = {
    title: {
      text: 'Nº de ocorrências de sincronização OpenMRS registadas nesta semana',
      display: true
    },
    legend: {
      display: true,
      position:'bottom'
    },
    tooltips: {
      enabled: true
    },
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          
          size:11
        },
        formatter: Math.round,
        display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0;
       }
      }
    }
  };
  public pieChartLabels7: string[] = [];
  public pieChartData7: any[] = [];

  //Chart8
  public barChartLabels8: string[] = [];
  public barChartType8: string = 'bar';
  public barChartLegend8: boolean = false;
  public barChartData8: any[] = [];
  public barChartOptions8: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Servidores com itens restantes por enviar na semana anterior',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },

      }]
    }
  };

  //Chart9
  public barChartLabels9: string[] = [];
  public barChartType9: string = 'bar';
  public barChartLegend9: boolean = false;
  public barChartData9: any[] = [];
  public barChartOptions9: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Servidores com itens restantes por enviar nesta semana',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },

      }]
    }
  };

  //Chart10
  public barChartLabels10: string[] = [];
  public barChartType10: string = 'bar';
  public barChartLegend10: boolean = false;
  public barChartData10: any[] = [];
  public barChartOptions10: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Servidores com itens restantes por receber na semana anterior',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },

      }]
    }
  };

  //Chart11
  public barChartLabels11: string[] = [];
  public barChartType11: string = 'bar';
  public barChartLegend11: boolean = false;
  public barChartData11: any[] = [];
  public barChartOptions11: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Servidores com itens restantes por receber nesta semana',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },

      }]
    }
  };

  //Charts12
  public doughnutChartLabels: string[] = ['Enviaram Backup', 'Sem registo'];
  public doughnutChartLabels2: string[] = ['Registaram sincronização', 'Sem registo'];
  public doughnutChartData;doughnutChartData2;doughnutChartData3;doughnutChartData4: any[] = [];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartOptions: any = {
    legend: {
      position: 'bottom',
  },
    circumference:Math.PI,
    rotation:Math.PI,
    cutoutPercentage:60
  };

  public doughnutChartOptions1: any = {
    title: {
      text: 'Completude de registo de envio/recepção de backups no mês anterior (FY' +this.datepipe.transform(this.prevMonth,'yy')+this.datepipe.transform(this.prevMonth,'MM')+")",
      display: true
    },
    legend: {
      position: 'bottom',
  },
    circumference:Math.PI,
    rotation:Math.PI,
    cutoutPercentage:60,
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 11,
        borderWidth: 1,
        color: 'white',
        font: {
          size:11
        },
        formatter: Math.round
      }
    }
  };

  public doughnutChartOptions2: any = {
    title: {
      text: 'Completude de registo de envio/recepção de backups neste mês (FY' +this.datepipe.transform(this.currentMonth,'yy')+this.datepipe.transform(this.currentMonth,'MM')+")",
      display: true
    },
    legend: {
      position: 'bottom',
  },
    circumference:Math.PI,
    rotation:Math.PI,
    cutoutPercentage:60,
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          size:11
        },
        formatter: Math.round
      }
    }
  };

  public doughnutChartOptions3: any = {
    title: {
      text: 'Completude de registo de sincronização OpenMRS na semana anterior',
      display: true
    },
    legend: {
      position: 'bottom',
  },
    circumference:Math.PI,
    rotation:Math.PI,
    cutoutPercentage:60,
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          size:11
        },
        formatter: Math.round
      }
    }
  };

  public doughnutChartOptions4: any = {
    title: {
      text: 'Completude de registo de sincronização OpenMRS nesta semana',
      display: true
    },
    legend: {
      position: 'bottom',
  },
    circumference:Math.PI,
    rotation:Math.PI,
    cutoutPercentage:60,
    plugins: {
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        font: {
          size:11
        },
        formatter: Math.round
      }
    }
  };

  public form: FormGroup;

   
  constructor(
    public datepipe: DatePipe,
    public translate: TranslateService,
    public serversService: ServersService,
    public districtsService: DistrictsService,
    public resourcesService: ResourcesService,
    public formBuilder: FormBuilder) {


    this.form = formBuilder.group({
      district: []
    });

  }
  ngOnInit() {

    console.log(this.currentMonth);

    this.isHidden=true;
    this.isAuth = false;
    this.chart1 = false;
    this.chart2 = false;
    this.chart3 = false;
    this.chart4 = false;
    this.chart5 = false;
    this.chart6 = false;
    this.chart7 = false;
    this.chart8 = false;
    this.chart9 = false;
    this.chart10 = false;
    this.chart11 = false;
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.ROLE_SIS || this.ROLE_IT || this.ROLE_OA || this.ROLE_GMA) {


        this.districtsService.findDistricts("","","",false,"fullName")
        .subscribe(data => {
          this.alldistricts = data.content;
          this.alldistricts2 = data.content;
        },error=>{},
      ()=>{
        
        this.resourcesService.getReceivedPM()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS district, [1] AS exist FROM ?data", [data]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          var total:number=0;
          for (let l of result) {
            label.push(l.district);
            value.push(l.exist);
            value2.push(0);
            this.alldistricts=this.alldistricts.filter(item=>item.fullName!=l.district);
            total=total+1;
          }

          for (let d of this.alldistricts) {
            label.push(d.fullName);
            value.push(0);
            value2.push(1);
          }
          

          this.doughnutChartData =[total,this.alldistricts.length];
 
          this.barChartLabels = label;
          this.barChartData = [
            { data: value, label: "Backup enviado e recebido no SIS" },
            { data: value2, label: "Sem registo" }];
        },
          error => { },
          () => {
            this.chart1 = true;
          });




          this.resourcesService.getReceivedTM()
          .subscribe(data => {
            var result = alasql("SELECT [0] AS district, [1] AS exist FROM ?", [data]);
            var label: string[] = [];
            var value: number[] = [];
            var value2: number[] = [];
            var total:number=0;
            for (let l of result) {
              label.push(l.district);
              value.push(l.exist);
              value2.push(0);
              this.alldistricts2=this.alldistricts2.filter(item=>item.fullName!=l.district);
              total=total+1;
            }


            for (let d of this.alldistricts2) {
              label.push(d.fullName);
              value.push(0);
              value2.push(1);
            }

            this.doughnutChartData2 =[total,this.alldistricts2.length];

            this.barChartLabels2 = label;
            this.barChartData2 = [
              { data: value, label: "Backup enviado e recebido no SIS" },
              { data: value2, label: "Sem registo" }];
          },
            error => { },
            () => {
              this.chart2 = true;
            });





      });

     
      
      this.resourcesService.getReceivedLast()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS received, [1] AS month, [2] AS restored FROM ?", [data]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          for (let l of result) {
            label.push(l.month);
            value.push(l.received);
            value2.push(l.restored);
          }
          this.lineChartLabels = label;
          this.lineChartData = [
            { data: value, label: "Backups recebidos" },
            { data: value2, label: "Backups restaurados" }];
        },
          error => { },
          () => {
            this.chart3 = true;
          });


          this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
          .subscribe(data => {

            this.allservers = data.content;
            this.allservers2 = data.content;
           
          }, error => { }, () => { 
            
            //AQUI
          
            this.resourcesService.findSyncsPW()
            .subscribe(data => {
              var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
              var label: string[] = [];
              var value: number[] = [];
              var value2: number[] = [];
              var value3: number[] = [];
              var total:number=0;
              if (data) {
                for (let l of result) {
                  label.push(l.district + ' - ' + l.server);
                  value.push(l.exist);
                  value2.push(l.error);
                  value3.push(0);
                  this.allservers=this.allservers.filter(item=> item.district.name+" - "+item.name!=l.district + ' - ' + l.server);
                  total=total+1;
                }
      
                for (let s of this.allservers) {
                  label.push(s.district.name+" - "+s.name);
                  value.push(0);
                  value2.push(0);
                  value3.push(1);
                }

                this.doughnutChartData3 =[total,this.allservers.length];
    
              }
              this.barChartLabels4 = label;
              this.barChartData4 = [
    
                { data: value, label: "Sincronização registada" },
                { data: value2, label: "Ocorrência registada" },
                { data: value3, label: "Sem registo" }
              ];
    
              var result2 = alasql("SELECT [1] AS district, SUM([4]) AS error FROM ? WHERE [4]>0 GROUP BY [1] ", [data]);
              var label2: string[] = [];
              var value3: number[] = [];
              if (data.length > 0 && result2.find(item => item.district != null)) {
                for (let l of result2) {
                  label2.push(l.district);
                  value3.push(l.error);
                }
              }
              this.pieChartLabels6 = label2;
              this.pieChartData6 = value3;
    
            },
              error => { },
              () => {
                this.chart4 = true;
                this.chart6 = true;
              });
    
          this.resourcesService.findSyncsTW()
            .subscribe(data => {
              var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
              var label: string[] = [];
              var value: number[] = [];
              var value2: number[] = [];
              var value3: number[] = [];
              var total:number=0;
              if (data) {
                for (let l of result) {
                  label.push(l.district + ' - ' + l.server);
                  value.push(l.exist);
                  value2.push(l.error);
                  value3.push(0);
                  this.allservers2=this.allservers2.filter(item=> item.district.name+" - "+item.name!=l.district + ' - ' + l.server);
                  total=total+1;
                }
      
                for (let s of this.allservers2) {
                  label.push(s.district.name+" - "+s.name);
                  value.push(0);
                  value2.push(0);
                  value3.push(1);
                }

                this.doughnutChartData4 =[total,this.allservers2.length];

              }
    
              this.barChartLabels5 = label;
              this.barChartData5 = [
                { data: value, label: "Sincronização registada" },
                { data: value2, label: "Ocorrência registada" },
                { data: value3, label: "Sem registo" }
              ];
    
              var result2 = alasql("SELECT [1] AS district, SUM([4]) AS error FROM ? WHERE [4]>0 GROUP BY [1] ", [data]);
              var label2: string[] = [];
              var value3: number[] = [];
              if (data.length > 0 && result2.find(item => item.district != null)) {
                for (let l of result2) {
                  label2.push(l.district);
                  value3.push(l.error);
                }
              }
              this.pieChartLabels7 = label2;
              this.pieChartData7 = value3;
    
    
            },
              error => { },
              () => {
                this.chart5 = true;
                this.chart7 = true;
              });
          
          
          
          });


      this.resourcesService.findSyncsItemsPW()
        .subscribe(data => {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 ORDER BY [3] DESC", [data]);
          var label: string[] = [];
          var value: number[] = [];

          for (let l of result) {
            label.push(l.district + ' - ' + l.server);
            value.push(l.its);
          }
          this.barChartLabels8 = label;
          this.barChartData8 = [
            { data: value, label: "Itens restantes por enviar" }];

          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 ORDER BY [4] DESC ", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          for (let l of result2) {
            label2.push(l.district + ' - ' + l.server);
            value3.push(l.itr);
          }

          this.barChartLabels10 = label2;
          this.barChartData10 = [
            { data: value3, label: "Itens restantes por receber" }];


        },
          error => { },
          () => {
            this.chart8 = true;
            this.chart10 = true;
          });

      this.resourcesService.findSyncsItemsTW()
        .subscribe(data => {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 ORDER BY [3] DESC", [data]);
          var label: string[] = [];
          var value: number[] = [];

          for (let l of result) {
            label.push(l.district + ' - ' + l.server);
            value.push(l.its);
          }
          this.barChartLabels9 = label;
          this.barChartData9 = [
            { data: value, label: "Itens restantes por enviar" }];


          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 ORDER BY [4] DESC ", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          for (let l of result2) {
            label2.push(l.district + ' - ' + l.server);
            value3.push(l.itr);
          }

          this.barChartLabels11 = label2;
          this.barChartData11 = [
            { data: value3, label: "Itens restantes por receber" }];

        },
          error => { },
          () => {
            this.chart9 = true;
            this.chart11 = true;
          });

    }
    if (this.ROLE_ODMA || this.ROLE_GDD || this.ROLE_ORMA) {
      this.resourcesService.getReceivedPM()
        .subscribe(data => {
          var districts=this.user.districts.filter(item=>item.canceled==false);
         
          var resulti = alasql("SELECT [0] AS name, [1] AS exist FROM ?", [data]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts ON resulti.name=districts.fullName", [resulti, districts]);
      
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = []
          var total: number=0;
          for (let l of result) {
            label.push(l.fullName);
            value.push(l.exist);
            value2.push(0);
            districts=districts.filter(item=>item.fullName!=l.fullName);
            total=total+1;
          }

          for (let d of districts) {
            label.push(d.fullName);
            value.push(0);
            value2.push(1);
          }

          this.doughnutChartData =[total,districts.length];

          this.barChartLabels = label;
          this.barChartData = [
            { data: value, label: "Backup enviado e recebido no SIS" },
            { data: value2, label: "sem registo" }];
        },
          error => { },
          () => {
            this.chart1 = true;
          });

      this.resourcesService.getReceivedTM()
        .subscribe(data => {

          var districts=this.user.districts.filter(item=>item.canceled==false);
         
          var resulti = alasql("SELECT [0] AS name, [1] AS exist FROM ?", [data]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts ON resulti.name=districts.fullName", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          var total: number=0;
          for (let l of result) {
            label.push(l.fullName);
            value.push(l.exist);
            value2.push(0);
            districts=districts.filter(item=>item.fullName!=l.fullName);
            total=total+1;
          }

          for (let d of districts) {
            label.push(d.fullName);
            value.push(0);
            value2.push(1);
          }

          this.doughnutChartData2 =[total,districts.length];


          this.barChartLabels2 = label;
          this.barChartData2 = [
            { data: value, label: "Backup enviado e recebido no SIS" },
            { data: value2, label: "Sem registo" }];

        },
          error => { },
          () => {
            this.chart2 = true;
          });


          this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
          .subscribe(data => {

            this.allservers3 = data.content;
            this.allservers4 = data.content;
           
          }, error => { }, () => { 
            
            //AQUI

      this.resourcesService.findSyncsPW()
        .subscribe(data => {
          var districts=this.user.districts.filter(item => item.parentDistrictId == null&&item.canceled==false);

          var resulti = alasql("SELECT [0] AS server,[1] AS name, [3] AS exist,[4] AS error FROM ?data ", [data, districts]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          var value3: number[] = [];
          var total: number=0;
          for (let l of result) {
            label.push(l.name + ' - ' + l.server);
            value.push(l.exist);
            if (l.error == 0) {
              value2.push(null);
            } else {
              value2.push(l.error);
            }
            value3.push(0);
            this.allservers3=this.allservers3.filter(item=> item.district.name+" - "+item.name!=l.name + ' - ' + l.server);
            total=total+1;
          }

          for (let s of this.allservers3) {
            label.push(s.district.name+" - "+s.name);
            value.push(0);
            value2.push(null);
            value3.push(1);
          }

          this.doughnutChartData3 =[total,this.allservers3.length];

          this.barChartLabels4 = label;
          this.barChartData4 = [

            { data: value, label: "Sincronização registada" }, { data: value2, label: "Ocorrência registada" }, { data: value3, label: "Sem registo" }];


        },
          error => { },
          () => {
            this.chart4 = true;

          });

      this.resourcesService.findSyncsTW()
        .subscribe(data => {
         var districts=this.user.districts.filter(item => item.parentDistrictId == null&&item.canceled==false);
          var resulti = alasql("SELECT [0] AS server,[1] AS name, [3] AS exist,[4] AS error FROM ?data ", [data, districts]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          var value3: number[] = [];
          var total: number=0;
          for (let l of result) {
            label.push(l.name + ' - ' + l.server);
            value.push(l.exist);
            if (l.error == 0) {
              value2.push(null);
            } else {
              value2.push(l.error);
            }
            value3.push(0);
            this.allservers4=this.allservers4.filter(item=> item.district.name+" - "+item.name!=l.name + ' - ' + l.server);
            total=total+1;
          }

          for (let s of this.allservers4) {
            label.push(s.district.name+" - "+s.name);
            value.push(0);
            value2.push(null);
            value3.push(1);
          }

          this.doughnutChartData4 =[total,this.allservers4.length];

          this.barChartLabels5 = label;
          this.barChartData5 = [

            { data: value, label: "Sincronização registada" }, { data: value2, label: "Ocorrência registada" }, { data: value3, label: "Sem registo" }];

        },
          error => { },
          () => {
            this.chart5 = true;
          });


        });
    }
  }

  search() {

    this.chart4 = false;
    this.chart5 = false;
    this.chart6 = false;
    this.chart7 = false;
    this.chart8 = false;
    this.chart9 = false;
    this.chart10 = false;
    this.chart11 = false;
    var userValue = this.form.value;

    this.resourcesService.findSyncsPW()
      .subscribe(data => {
        if (userValue.district == "all") {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
        } else {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?data WHERE [1]='" + userValue.district + "'", [data]);
        }

        var label: string[] = [];
        var value: number[] = [];
        var value2: number[] = [];

        if (data) {
          for (let l of result) {
            if (userValue.district == "all") {
              label.push(l.district + ' - ' + l.server);
            } else {
              label.push(l.server);
            }
            value.push(l.exist);
            value2.push(l.error);
          }

        }
        this.barChartLabels4 = label;
        this.barChartData4 = [

          { data: value, label: "Sincronização registada" },
          { data: value2, label: "Erro encontrado" }
        ];
        if (userValue.district == "all") {
          var result2 = alasql("SELECT [1] AS district, SUM([4]) AS error FROM ? WHERE [4]>0 GROUP BY [1] ", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          if (data.length > 0 && result2.find(item => item.district != null)) {
            for (let l of result2) {
              label2.push(l.district);
              value3.push(l.error);
            }
          }
        } else {
          var result2 = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?data WHERE [1]='" + userValue.district + "'", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          if (data.length > 0) {
            for (let l of result2) {
              if (l.error > 0) {
                label2.push(l.server);
                value3.push(l.error);
              }
            }
          }
        }

        this.pieChartLabels6 = label2;
        this.pieChartData6 = value3;

      },
        error => { },
        () => {
          this.chart4 = true;
          this.chart6 = true;
        });

    this.resourcesService.findSyncsTW()
      .subscribe(data => {

        if (userValue.district == "all") {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
        } else {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?data WHERE [1]='" + userValue.district + "'", [data]);
        }

        var label: string[] = [];
        var value: number[] = [];
        var value2: number[] = [];
        if (data) {
          for (let l of result) {
            if (userValue.district == "all") {
              label.push(l.district + ' - ' + l.server);
            } else {
              label.push(l.server);
            }
            value.push(l.exist);
            value2.push(l.error);
          }
        }

        this.barChartLabels5 = label;
        this.barChartData5 = [
          //, type: "line", fill: "false"
          { data: value, label: "Sincronização registada" },
          { data: value2, label: "Erro encontrado" }
        ];
        if (userValue.district == "all") {
          var result2 = alasql("SELECT [1] AS district, SUM([4]) AS error FROM ? WHERE [4]>0 GROUP BY [1] ", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          if (data.length > 0 && result2.find(item => item.district != null)) {
            for (let l of result2) {
              label2.push(l.district);
              value3.push(l.error);
            }
          }
        } else {
          var result2 = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?data WHERE [1]='" + userValue.district + "'", [data]);
          var label2: string[] = [];
          var value3: number[] = [];
          if (data.length > 0) {
            for (let l of result2) {
              if (l.error > 0) {
                label2.push(l.server);
                value3.push(l.error);
              }
            }
          }

        }


        this.pieChartLabels7 = label2;
        this.pieChartData7 = value3;


      },
        error => { },
        () => {
          this.chart5 = true;
          this.chart7 = true;
        });



    this.resourcesService.findSyncsItemsPW()
      .subscribe(data => {

        if (userValue.district == "all") {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 ORDER BY [3] DESC", [data]);
        } else {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 AND [2]='" + userValue.district + "' ORDER BY [3] DESC", [data]);
        }


        var label: string[] = [];
        var value: number[] = [];

        for (let l of result) {
          if (userValue.district == "all") {
            label.push(l.district + ' - ' + l.server);
          } else {
            label.push(l.server);
          }
          value.push(l.its);
        }
        this.barChartLabels8 = label;
        this.barChartData8 = [
          { data: value, label: "Itens restantes por enviar" }];

        if (userValue.district == "all") {
          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 ORDER BY [4] DESC ", [data]);
        } else {
          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 AND [2]='" + userValue.district + "' ORDER BY [4] DESC ", [data]);
        }

        var label2: string[] = [];
        var value3: number[] = [];
        for (let l of result2) {
          if (userValue.district == "all") {
            label2.push(l.district + ' - ' + l.server);
          } else {
            label2.push(l.server);
          }
          value3.push(l.itr);
        }

        this.barChartLabels10 = label2;
        this.barChartData10 = [
          { data: value3, label: "Itens restantes por receber" }];


      },
        error => { },
        () => {
          this.chart8 = true;
          this.chart10 = true;
        });

    this.resourcesService.findSyncsItemsTW()
      .subscribe(data => {
        if (userValue.district == "all") {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 ORDER BY [3] DESC", [data]);
        } else {
          var result = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [3]>0 AND [2]='" + userValue.district + "' ORDER BY [3] DESC", [data]);
        }
        var label: string[] = [];
        var value: number[] = [];

        for (let l of result) {
          if (userValue.district == "all") {
            label.push(l.district + ' - ' + l.server);
          } else {
            label.push(l.server);
          }
          value.push(l.its);
        }
        this.barChartLabels9 = label;
        this.barChartData9 = [
          { data: value, label: "Itens restantes por enviar" }];


        if (userValue.district == "all") {
          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 ORDER BY [4] DESC ", [data]);
        } else {
          var result2 = alasql("SELECT [1] AS server,[2] AS district, [3] AS its,[4] AS itr FROM ? WHERE [4]>0 AND [2]='" + userValue.district + "' ORDER BY [4] DESC ", [data]);
        }
        var label2: string[] = [];
        var value3: number[] = [];
        for (let l of result2) {
          if (userValue.district == "all") {
            label2.push(l.district + ' - ' + l.server);
          } else {
            label2.push(l.server);
          }
          value3.push(l.itr);
        }

        this.barChartLabels11 = label2;
        this.barChartData11 = [
          { data: value3, label: "Itens restantes por receber" }];

      },
        error => { },
        () => {
          this.chart9 = true;
          this.chart11 = true;
        });


  }

}
