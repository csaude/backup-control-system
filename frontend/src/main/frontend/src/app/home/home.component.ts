/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Component, OnInit } from '@angular/core';
import { DistrictsService } from "../districts/shared/districts.service";
import { TranslateService } from 'ng2-translate';
import * as alasql from 'alasql';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_ODMA: string;
  public ROLE_GDD: string;
  public ROLE_ORMA: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public isAuth: boolean;
  public isAuthHq: boolean;
  public chart1; chart2; chart3: boolean;
  //Chart1
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  public barChartData: any[] = [];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Backups efectuados no mês anterior recebidos no SIS',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function(label, index, labels) {
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
      text: 'Backups efectuados neste mês recebidos no SIS',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function(label, index, labels) {
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
      text: 'Backups dos últimos 12 meses recebidos e restaurados',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function(label, index, labels) {
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
  constructor(
    public translate: TranslateService,
    public districtsService: DistrictsService ) { }
  ngOnInit() {
    this.isAuth = false;
    this.chart1 = false;
    this.chart2 = false;
    this.chart3 = false;
    this.ROLE_SIS = window.localStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.localStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.localStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.localStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.localStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.localStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.localStorage.getItem('ROLE_GMA');
    if(this.ROLE_SIS||this.ROLE_IT||this.ROLE_OA||this.ROLE_GMA){
    this.districtsService.getReceivedPM()
      .subscribe(data => {
        var result = alasql("SELECT [0] AS district, [1] AS exist FROM ?", [data]);
        var label: string[] = [];
        var value: number[] = [];
        for (let l of result) {
          label.push((l.district.split('Quelimane (').join('')).split(')').join(''));
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
          label.push((l.district.split('Quelimane (').join('')).split(')').join(''));
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
      }
      if(this.ROLE_ODMA||this.ROLE_GDD||this.ROLE_ORMA){
        this.districtsService.getSendPM()
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
              { data: value, label: "Backup enviado" }];
          },
            error => { },
            () => {
              this.chart1 = true;
            });
    
        this.districtsService.getSendTM()
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
              { data: value, label: "Backup enviado" }];
    
          },
            error => { },
            () => {
              this.chart2 = true;
            });
    
       
          }
  }
}
