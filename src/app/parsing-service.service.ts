import { Injectable } from '@angular/core';
import { IBowlingResult } from './ibowling-result'
import { of, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  private bowlingResultsSubject: BehaviorSubject<IBowlingResult[]> = new BehaviorSubject(new Array<IBowlingResult>());

  parseTextToData(rawTextData: string): Observable<boolean> {
    if (!rawTextData) {
      return of(false);
    }
    console.log(rawTextData);

    return of(this.performParsing(rawTextData));
  }

  /** Pefroms parsing, updates data and returns whether parsing was successful. */
  private performParsing(rawTextData: string): boolean {
    let bowlingResults: IBowlingResult[] = [];
    try {
      bowlingResults = this.parseAndValidateRawText(rawTextData);
    } catch(error: unknown) {
      let errorMessage;
      if (typeof error === "string") {
        errorMessage = error.toUpperCase() // works, `e` narrowed to string
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      console.log("Parsing failed due to " + errorMessage);
      return false;
    } finally{
      this.bowlingResultsSubject.next(bowlingResults);
    }
    
    console.log("Parsing was successful!!");
    return true;
  }

  getBowlingResults(): BehaviorSubject<IBowlingResult[]> {
    return this.bowlingResultsSubject;
  }

  /** 
   * Attempts to parse and validate raw text to expected data format.
   * Throws an error when invalid data is encountered.
   */
  private parseAndValidateRawText(rawText: string): IBowlingResult[] {
    const textLines = rawText.trim().split(/\r?\n/);
    if (textLines.length % 2 !== 0) {
      return [];
    }

    const results = [];

    for (let i = 0; i + 1 < textLines.length; i += 2) {
      const playerName = textLines[i].trim();
      const scores = this.parseAndValidateScoresString(textLines[i + 1]);
      const totalScore = this.calculateTotalScore(scores);

      const bowlingResult:IBowlingResult = {
        playerName, scores, totalScore
      };

      results.push(bowlingResult);
    }

    return results;
  }

  /** Parses and validates scores string. */
  private parseAndValidateScoresString(scoresLine: string): number[] {
    const scoresStrings = scoresLine.split(",").map(str => str.trim())

    if(scoresStrings.some(item => !this.isNumeric(item))){
      throw new Error("Nieprawidłowy format! Przynajmniej jeden z rzutów jest nie jest numerem");
    }

    const numericScores = scoresStrings.map(str => parseInt(str));

    if(numericScores.length < 20 || numericScores.length > 21){
      throw new Error("Nieprawidłowy format. Oczekiwano numer rzutów 20 lub 21 a było " + numericScores.length);
    }

    for (let i = 0; i + 1 < numericScores.length; i += 2) {
      const scoreForBothRolls = numericScores[i] + numericScores[i + 1]
      if(scoreForBothRolls > 10) {
        throw new Error("Nieprawidłowy format. W jednej rundzie można maksymalnie zdobyć 10 punktów a zawodnik zdobył " + scoreForBothRolls);
      }
    }

    return numericScores; 
  }

  /** Calculates total score based on the game rules. */
  private calculateTotalScore(scores: number[]): number {
    // TODO: implement this menthod
    return 999;
  }

  private isNumeric(possibleNumber?: string | number): boolean {
    return possibleNumber != null
      && possibleNumber !== ''
      && !isNaN(Number(possibleNumber));
  }
}
