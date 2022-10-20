import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { userTextArrt } from '../utils/consts';

@Injectable()
export class TextService {
  private userTextObj$ = new BehaviorSubject<Array<userTextArrt>>([]);
  private timeTillFinish$ = new BehaviorSubject<number>(30);
  private WPM_Sample$ = new BehaviorSubject<Array<number>>([]);
  
  constructor() {}

  setUserText(userTextObj: Array<userTextArrt>) {
    this.userTextObj$.next(userTextObj);
  }

  getUserText(): Array<userTextArrt> {
    return this.userTextObj$.value;
  }

  setTimer(time: number): void { 
    this.timeTillFinish$.next(time);
  }

  getTimer(): number {
    return this.timeTillFinish$.value;
  }

  setWPM_Sample(WPM_Sample: Array<number>): void {
    this.WPM_Sample$.next(WPM_Sample);
  }

  getWPM_Sample(): Array<number> {
    return this.WPM_Sample$.value;
  }


  private _mySubj: Subject<number> = new Subject<number>();
  public data: Observable<number> = this._mySubj.asObservable();
  private _id: any = 0;
  private _RndNr: number = 0;

  //start Stopwatch
  startStopwatch(): void {
    if (!this._id) {
      setTimeout(() => {
        this._id = setInterval(
          () => {
            this._RndNr++;
            this._mySubj.next(this._RndNr)
          }, 1000);
      }, 300);
    }
  }

  resetStopwatch(): void {
    clearInterval(this._id);
    this._id = 0;
    this._RndNr = 0;
  }

}