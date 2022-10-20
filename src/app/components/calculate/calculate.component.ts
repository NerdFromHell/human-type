import { TextComponent } from './../text/text.component';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { TextService } from 'src/app/Services/text.service';
import { Component, Input, OnInit } from '@angular/core';
import { userTextArrt } from 'src/app/utils/consts';
import Chart from 'chart.js/auto';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {

  public userTextObj!: Array<userTextArrt>;
  public WPM_Sample!: Array<number>; // y axies reference
  public maxWPM: number = 0;
  public timer!: number;
  public timeStamps: Array<number> = []; // x axies reference
  public correctLetters!: number;
  public incorrectLetters!: number;
  public extraLetters!: number;
  public chart!: any; // line chart

  constructor(private router: Router, private textService: TextService) { }

  ngOnInit(): void {
    this.initialize();

    this.countStatus();
    this.calculateWPM();
    this.createChart();
  }

  initialize(): void {
    this.userTextObj = this.textService.getUserText();
    this.timer = this.textService.getTimer();
    this.WPM_Sample = this.textService.getWPM_Sample();
    this.correctLetters = 0;
    this.incorrectLetters = 0;
    this.extraLetters = 0;
  }

  calculateWPM(): void {
    this.WPM_Sample.forEach((element, index) => {
      this.WPM_Sample[index] = ((element / 5) * 60) / (index + 1);// fixing the wpm sample
      if (this.maxWPM < this.WPM_Sample[index])
        this.maxWPM = this.WPM_Sample[index];
      this.timeStamps.push(index + 1);
    });
  }

  countStatus(): void {
    this.userTextObj.map(val => {
      val.status.map(state => {
        if (state === 'correct') {
          this.correctLetters++;
        }
        else if (state === 'incorrect') {
          this.incorrectLetters++;
        }
        else if (state === 'extra') {
          this.extraLetters++;
        }
      });
    });
  }

  createChart(): void {
    this.chart = new Chart("WPM_Chart", {
      type: 'line', //this denotes tha type of chart
      data: {
        labels: this.timeStamps, // values on X-Axis
        datasets: [{
          data: this.WPM_Sample, // values on Y-Axis
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2,
          fill: true
        }]
      },
      options: { 
        aspectRatio: 3,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: { 
          x: {
            title: {
              display: true,
              text: 'time passed'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Words Per Minute'
            },
            beginAtZero: true,
            max: Math.floor(this.maxWPM + 5), // max number on Y-Axis
            ticks: {
              stepSize: (this.maxWPM / 4) - ((this.maxWPM / 4) % 10) + 10
            }
          }
        }
      }   
    });
  }

  newTypingTest(): void {  

    // this.router.navigate(['/']);
    window.location.href = '/';
  }
}
