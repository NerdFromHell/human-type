import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { common, userTextArrt } from '../../utils/consts';
import { Router } from '@angular/router';
import { TextService } from 'src/app/Services/text.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  public uniqueWords: number = 50;
  public uniqueWordsSample: Array<number> = [25, 50, 100, 200, 350, 500];

  public wordToType: number = 25;
  public wordToTypeSample: Array<number> = [10, 25, 50, 100, 200];
  public finshedWrite: boolean = false;

  public time: number = 15 ;
  public timerSample: Array<number> = [15, 30, 60, 120, 150];
  public isTimerMode: boolean = false;
  public timerChange: boolean = false;
  public timeLeft!: number;
  public interval: any;
  public subscribeTimer!: any;

  public textSample!: Array<string>;
  public userTextObj!: Array<userTextArrt>;   
  public WPM!: Array<number>; //WPM tracking every second

  public wordPointer!: number;
  public letterIndex!: number;

  public keyUp: boolean = true;

  constructor(private route: Router, private textService: TextService) {}

  ngOnInit(): void {
    
    this.generateTextSample();
    addEventListener('keydown', (event: KeyboardEvent) => {
      if(event.key !== 'Shift' && event.key !== 'Enter' && event.key !== 'Alt' && event.key !== 'Tab' && event.key !== 'Escape' && event.key !=='Meta') {
        if(this.isTimerMode && this.userTextObj.length === 0) {
          this.startTimer();
        }
        else if(this.userTextObj.length === 0) {
          this.startStopwatch();
        }
        this.onKey(event);
      }
    });
  }

  /**
   * initializion
   */
  initialize(): void {
    this.userTextObj = [];
    this.textService.setUserText(this.userTextObj);//empting user input 
    this.textSample = [];
    this.WPM = [];
    this.textService.setWPM_Sample(this.WPM);
    this.timeLeft = this.time;
    this.wordPointer = 0;
    this.letterIndex = 0;
    this.finshedWrite = false;
  }

  /**
   * generating a new text based on properties
   */
  generateTextSample(): void {
    this.initialize();
    var lastestWordIndex: number = -1;
    var wordIndex: number = this.randomInteger(this.uniqueWords);
    for (let index = 0; index < this.wordToType; index++) {
      while(lastestWordIndex === wordIndex) {
        wordIndex = this.randomInteger(this.uniqueWords);
      }
      lastestWordIndex = wordIndex;
      this.textSample.push(Object.assign([], common[wordIndex]));
    }
  }

  /**
   * return a random index of the selected word sample
   *
   * @param max up to the most common word selected from the list
   * @returns the index of the common word
   */
  randomInteger(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  /**
   * Setting the words count needed to type to finish calculating
   *
   * @param newCount is the words count needed to finish
   */
  changeWordCount(newCount: number): void {
    this.wordToType = newCount;
    this.generateTextSample();
  }

  /**
   * Setting the common sample size
   *
   * @param newAmount is the sample size from the most common words
   */
  changeSampleAmount(newAmount: number): void {
    this.uniqueWords = newAmount;
    this.generateTextSample();
  }

  /**
   * Setting a timer
   *
   * @param newTimer is the time required to finish calculation
   */
  changeTimer(newTimer: number): void {
    this.timerChange = true;
    this.time = newTimer;
    // this.timeLeft = newTimer;
    this.wordToType = newTimer * 3;
    this.textService.resetStopwatch();
    this.generateTextSample();
  }

  /**
   * Keeping track of timer and WPM
   */
  startTimer(): void {
    this.textService.startStopwatch();
    this.textService.data.subscribe((x)=> {
      this.timeLeft = this.time - x;
      if (x > this.time){
        this.textService.setUserText(this.userTextObj);
        this.textService.setTimer(this.time);
        this.textService.setWPM_Sample(this.WPM);
        this.textService.resetStopwatch();
        this.route.navigate(['/cal']);
      }
      else {
        var countCorrectWordsLettes: number = 0;
          this.userTextObj.map(obj => {
          if (obj.complete === 'correct')
          countCorrectWordsLettes += obj.word.length;
          });
        this.WPM.push(countCorrectWordsLettes);
      }
    });
  }

    /**
   * Keeping track of time and WPM
   */
  startStopwatch(): void {
    this.textService.startStopwatch();
    this.textService.data.subscribe((x) => {
      if (this.finshedWrite){
        this.textService.setUserText(this.userTextObj);
        this.textService.setTimer(x/5);
        this.textService.setWPM_Sample(this.WPM);
        this.textService.resetStopwatch();
        this.route.navigate(['/cal']);
      }
      else {
        console.log(x)
        var countCorrectWordsLettes: number = 0;
          this.userTextObj.map(obj => {
          if (obj.complete === 'correct')
          countCorrectWordsLettes += obj.word.length;
          });
        this.WPM.push(countCorrectWordsLettes);
      }
    });
  }

  /**
   * @param event keypress character
   */
  onKey(event: KeyboardEvent){
    console.log(event.key)
    if(event.key === 'Backspace' ) { //deletes one character or space
      if(this.letterIndex === 0 && this.wordPointer > 0 && this.userTextObj[this.wordPointer-1].complete !== 'correct') {
        this.wordPointer--;
        this.letterIndex = this.userTextObj[this.wordPointer].word.length;
      }
      else if(this.letterIndex > 0){
        this.userTextObj[this.wordPointer].word = this.userTextObj[this.wordPointer].word.slice(0,this.letterIndex - 1);
        this.userTextObj[this.wordPointer].status = this.userTextObj[this.wordPointer].status?.slice(0,this.letterIndex - 1);
        this.letterIndex--;
      }
    }
    else if (event.key === 'Delete') {// needs to be ctrl + backspace combined
      this.userTextObj[this.wordPointer].word = [];
      this.userTextObj[this.wordPointer].status = [];
      this.letterIndex = 0;
    }
    else if(event.code !== 'Space') {
      if(event.key.length > 1) return; //any input that is not a letter (like FN12, SHIFT etc)
      if(this.letterIndex === 0) { //in case the character is the first letter in the current word
        this.userTextObj[this.wordPointer] = { //defining a new word in the user text array
          word: [event.key],
          status: [],
          complete: 'incorrect',
          countCorrect: 0
        };

        //marking if the character is the same as the sample
        if(event.key === this.textSample[this.wordPointer][this.letterIndex]) { 
          this.userTextObj[this.wordPointer].status = ['correct'];
        }
        else {
          this.userTextObj[this.wordPointer].status = ['incorrect'];
        }
      }
      else {
        this.userTextObj[this.wordPointer].word.push(event.key);
        if (this.userTextObj[this.wordPointer].word.length > this.textSample[this.wordPointer].length) {
          this.userTextObj[this.wordPointer].status?.push('extra');
        }
        else if(event.key === this.textSample[this.wordPointer][this.letterIndex]) {
          this.userTextObj[this.wordPointer].status?.push('correct');
          if(this.letterIndex === this.textSample[this.wordPointer].length - 1 && this.textSample.length - 1 === this.wordPointer) {
            if (!this.isTimerMode) {
              this.finshedWrite = true;
            }
            console.log('done');
          }
        }
        else {
          this.userTextObj[this.wordPointer].status?.push('incorrect')
        }
      }
      this.letterIndex++;
    }
    else if (this.letterIndex != 0) {
      this.userTextObj[this.wordPointer].complete = 'correct';
      if (this.userTextObj[this.wordPointer].word.length !== this.textSample[this.wordPointer].length) {
        this.userTextObj[this.wordPointer].complete = 'incorrect';
      }
      else {
        this.userTextObj[this.wordPointer].status?.map(letterStatus => {
            if(letterStatus !== 'correct') {
              this.userTextObj[this.wordPointer].complete = 'incorrect';
            }
          }
        );
      }
      if(this.userTextObj[this.wordPointer].complete === 'correct')  {
        this.userTextObj[this.wordPointer].countCorrect++;
      }
      if(this.textSample.length - 1 === this.wordPointer) {
        this.textService.setUserText(this.userTextObj);
      }
      this.letterIndex = 0;
      this.wordPointer++;
    }
  }
}
