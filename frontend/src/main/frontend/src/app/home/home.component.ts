/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DistrictsService } from "../districts/shared/districts.service";
import { ServersService } from "../servers/shared/servers.service";
import { TranslateService } from 'ng2-translate';
import * as alasql from 'alasql';
import { District } from '../districts/shared/district';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class HomeComponent implements OnInit {

  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;
  public isAuth: boolean;
  public isAuthHq: boolean;
  public chart1; chart2; chart3; chart4; chart5; chart6; chart7; chart8; chart9; chart10; chart11: boolean;
  public user;
  //Chart1
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  public barChartData: any[] = [];
  public alldistricts: District[] = [];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de backups efectuados no mês anterior recebidos',
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
    }
  };
  public myColors = [
    {
      backgroundColor: 'rgba(54, 162, 235, .6)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    }
  ];

  public myColors2 = [
    {
      backgroundColor: 'rgba(54, 162, 235, .6)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    },

    {
      backgroundColor: 'rgba(255, 99, 132, .6)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    },

  ];
  //Chart2
  public barChartLabels2: string[] = [];
  public barChartType2: string = 'bar';
  public barChartLegend2: boolean = false;
  public barChartData2: any[] = [];
  public barChartOptions2: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de backups efectuados neste mês recebidos',
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
    }
  };
  //Chart3
  public lineChartLabels: string[] = [];
  public lineChartType: string = 'line';
  public lineChartLegend: boolean = true;
  public lineChartData: any[] = [];
  //Line Chart
  public lineChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de distritos que enviaram backups nos últimos 12 meses',
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
    }
  };


  //Chart4
  public barChartLabels4: string[] = [];
  public barChartType4: string = 'bar';
  public barChartLegend4: boolean = true;
  public barChartData4: any[] = [];
  public barChartOptions4: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de sincronizações registadas na semana anterior',
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
    }
  };

  //Chart5
  public barChartLabels5: string[] = [];
  public barChartType5: string = 'bar';
  public barChartLegend5: boolean = true;
  public barChartData5: any[] = [];
  public barChartOptions5: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Nº de sincronizações registadas nesta semana',
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
    }
  };

  //Chart6
  public pieChartType6: string = 'pie';
  public pieOptions6: any = {
    title: {
      text: 'Nº de erros de sincronização encontrados na semana anterior',
      display: true
    },
    legend: {
      display: true
    },
    tooltips: {
      enabled: true
    }
  };
  public pieChartLabels6: string[] = [];
  public pieChartData6: any[] = [];

  //Chart7
  public pieChartType7: string = 'pie';
  public pieOptions7: any = {
    title: {
      text: 'Nº de erros de sincronização encontrados nesta semana',
      display: true
    },
    legend: {
      display: true
    },
    tooltips: {
      enabled: true
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

  public form: FormGroup;

   
  constructor(
    public translate: TranslateService,
    public districtsService: DistrictsService,
    public serversService: ServersService, formBuilder: FormBuilder) {


    this.form = formBuilder.group({
      district: []
    });

  }
  ngOnInit() {
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


      this.districtsService.getDistricts()
        .subscribe(data => {
          var filteredd = data.filter(item => item.parentdistrict == null);
          this.alldistricts = filteredd;
        });

      this.districtsService.getReceivedPM()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS district, [1] AS exist FROM ?", [data]);
          var label: string[] = [];
          var value: number[] = [];
          for (let l of result) {
            label.push(l.district);
            value.push(l.exist);
          }
          this.barChartLabels = label;
          this.barChartData = [
            { data: value, label: "Backup recebido" }];
        },
          error => { },
          () => {
            this.chart1 = true;
          });
      this.districtsService.getReceivedTM()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS district, [1] AS exist FROM ?", [data]);
          var label: string[] = [];
          var value: number[] = [];
          for (let l of result) {
            label.push(l.district);
            value.push(l.exist);
          }
          this.barChartLabels2 = label;
          this.barChartData2 = [
            { data: value, label: "Backup recebido" }];
        },
          error => { },
          () => {
            this.chart2 = true;
          });
      this.districtsService.getReceivedLast()
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

      this.serversService.getSyncsPW()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];

          if (data) {
            for (let l of result) {
              label.push(l.district + ' - ' + l.server);
              value.push(l.exist);
              value2.push(l.error);
            }

          }
          this.barChartLabels4 = label;
          this.barChartData4 = [

            { data: value, label: "Sincronização registada" },
            { data: value2, label: "Erro encontrado" }
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

      this.serversService.getSyncsTW()
        .subscribe(data => {
          var result = alasql("SELECT [0] AS server,[1] AS district, [3] AS exist,[4] AS error FROM ?", [data]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          if (data) {
            for (let l of result) {
              label.push(l.district + ' - ' + l.server);
              value.push(l.exist);
              value2.push(l.error);
            }
          }

          this.barChartLabels5 = label;
          this.barChartData5 = [
            { data: value, label: "Sincronização registada" },
            { data: value2, label: "Erro encontrado" }
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

      this.serversService.getSyncsItemsPW()
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

      this.serversService.getSyncsItemsTW()
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
      this.districtsService.getReceivedPM()
        .subscribe(data => {
          var districts;
          if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict != null)) {
            districts = this.user.districts.filter(item => item.parentdistrict != null);
          }
          else if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict == null)) {
            districts = this.user.districts;
          }


          var resulti = alasql("SELECT [0] AS name, [1] AS exist FROM ?", [data]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          for (let l of result) {
            label.push(l.name);
            value.push(l.exist);
          }
          this.barChartLabels = label;
          this.barChartData = [
            { data: value, label: "Backup enviado" }];
        },
          error => { },
          () => {
            this.chart1 = true;
          });

      this.districtsService.getReceivedTM()
        .subscribe(data => {

          var districts;
          if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict != null)) {
            districts = this.user.districts.filter(item => item.parentdistrict != null);
          }
          else if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict == null)) {
            districts = this.user.districts;
          }

          var resulti = alasql("SELECT [0] AS name, [1] AS exist FROM ?", [data]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          for (let l of result) {
            label.push(l.name);
            value.push(l.exist);
          }
          this.barChartLabels2 = label;
          this.barChartData2 = [
            { data: value, label: "Backup enviado" }];

        },
          error => { },
          () => {
            this.chart2 = true;
          });

      this.serversService.getSyncsPW()
        .subscribe(data => {
          var districts;
          if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict != null)) {
            districts = this.user.districts.filter(item => item.parentdistrict != null);
          }
          else if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict == null)) {
            districts = this.user.districts;
          }
          var resulti = alasql("SELECT [0] AS server,[1] AS name, [3] AS exist,[4] AS error FROM ?data ", [data, districts]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          for (let l of result) {
            label.push(l.name + ' - ' + l.server);
            value.push(l.exist);
            if (l.error == 0) {
              value2.push(null);
            } else {
              value2.push(l.error);
            }

          }
          this.barChartLabels4 = label;
          this.barChartData4 = [

            { data: value, label: "Sincronização registada" }, { data: value2, label: "Erro encontrado" }];


        },
          error => { },
          () => {
            this.chart4 = true;

          });

      this.serversService.getSyncsTW()
        .subscribe(data => {
          var districts;
          if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict != null)) {
            districts = this.user.districts.filter(item => item.parentdistrict != null);
          }
          else if (!this.ROLE_SIS && this.user.districts.find(item => item.parentdistrict == null)) {
            districts = this.user.districts;
          }
          var resulti = alasql("SELECT [0] AS server,[1] AS name, [3] AS exist,[4] AS error FROM ?data ", [data, districts]);
          var result = alasql("SELECT * FROM ?resulti JOIN ?districts USING name", [resulti, districts]);
          var label: string[] = [];
          var value: number[] = [];
          var value2: number[] = [];
          for (let l of result) {
            label.push(l.name + ' - ' + l.server);
            value.push(l.exist);
            if (l.error == 0) {
              value2.push(null);
            } else {
              value2.push(l.error);
            }

          }
          this.barChartLabels5 = label;
          this.barChartData5 = [

            { data: value, label: "Sincronização registada" }, { data: value2, label: "Erro encontrado" }];

        },
          error => { },
          () => {
            this.chart5 = true;
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

    this.serversService.getSyncsPW()
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

    this.serversService.getSyncsTW()
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



    this.serversService.getSyncsItemsPW()
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

    this.serversService.getSyncsItemsTW()
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
