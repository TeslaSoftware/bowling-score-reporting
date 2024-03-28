import { Injectable } from '@angular/core';
import { IBowlingResult } from './ibowling-result'
import { of, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  private bowlingResultsSubject: BehaviorSubject<IBowlingResult[]> = new BehaviorSubject(new Array<IBowlingResult>());

  parseTextToData(textData: string): Observable<boolean> {
    if (!textData) {
      return of(false);
    }
    console.log(textData);

    return of(true);
  }

  getBowlingResults(): BehaviorSubject<IBowlingResult[]> {
    return this.bowlingResultsSubject;
  }
}
