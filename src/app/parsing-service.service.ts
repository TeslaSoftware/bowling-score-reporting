import { Injectable } from '@angular/core';
import { IBowlingResult } from './ibowling-result'
import { of, Observable, BehaviorSubject } from 'rxjs';

/** 
 * Service parsing and validating raw text data into bowling result type. 
 * In addition service also stores the data containing bowiling results 
 * and allows other components to access it via its public method.
 * */
@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  private bowlingResultsSubject: BehaviorSubject<IBowlingResult[]> = new BehaviorSubject(new Array<IBowlingResult>());

  parseTextToData(rawTextData: string): Observable<string> {
    if (!rawTextData) {
      return of('Błąd podczas przetwarzania pliku. Plik jest pusty!');
    }
    console.log(rawTextData);

    return of(this.performParsing(rawTextData));
  }

  /** Pefroms parsing, updates data and returns whether parsing was successful. */
  private performParsing(rawTextData: string): string {
    let bowlingResults: IBowlingResult[] = [];
    try {
      bowlingResults = this.parseAndValidateRawText(rawTextData);
    } catch (error: unknown) {
      let errorMessage = '';
      if (typeof error === "string") {
        errorMessage = error.toUpperCase()
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      console.log("Parsing failed due to " + errorMessage);
      return errorMessage;
    } finally {
      this.bowlingResultsSubject.next(bowlingResults);
    }

    console.log("Parsing was successful!!");
    console.log(bowlingResults);
    return '';
  }

  getBowlingResults(): BehaviorSubject<IBowlingResult[]> {
    return this.bowlingResultsSubject;
  }

  /** 
   * Attempts to parse and validate raw text to expected data format.
   * 
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

      const bowlingResult: IBowlingResult = {
        playerName, scores, totalScore
      };

      results.push(bowlingResult);
    }

    return results;
  }

  /** 
   * Parses and validates scores from raw text line of scores separated by commas. 
   * 
   * Assumes that when player scores strike (10 pins) in first roll of a given frame,
   * the second roll of this frame will be marked as 0.
   * Therefore there always will be between 20 and 22 rolls in total.
   * */
  private parseAndValidateScoresString(scoresLine: string): number[] {
    const scoresStrings = scoresLine.split(",").map(str => str.trim())

    if (scoresStrings.some(item => !this.isNumeric(item))) {
      throw new Error("Nieprawidłowy format! Przynajmniej jeden z rzutów jest nie jest numerem");
    }

    const numericScores = scoresStrings.map(str => parseInt(str));

    if (numericScores.length < 20 || numericScores.length > 22) {
      throw new Error("Nieprawidłowy format. Oczekiwano numer rzutów między 20 a 22, a było " + numericScores.length);
    }

    for (let i = 0; i + 1 < numericScores.length; i += 2) {
      const scoreForBothRolls = numericScores[i] + numericScores[i + 1]
      if (scoreForBothRolls > 10) {
        throw new Error("Nieprawidłowy format. W jednej rundzie można maksymalnie zdobyć 10 punktów a zawodnik zdobył " + scoreForBothRolls);
      }
    }

    return numericScores;
  }

  /** 
   * Calculates total score based on the game rules. 
   * 
   * Assumes that when player scores strike (10 pins) in first roll of a given frame,
   * the second roll of this frame will be marked as 0. 
   * Therefore there always will be between 20 and 22 rolls in total.
   * */
  private calculateTotalScore(scores: number[]): number {
    let isStrike = false;
    let isSpare = false;

    let totalScore = 0;

    for (let i = 0; i < scores.length; i += 2) {
      const firstRoll = scores[i];
      const secondRoll = i + 1 == scores.length ? 0 : scores[i + 1];

      totalScore += (firstRoll + secondRoll);

      // Add bonuses from previous frame
      if (isStrike) {
        totalScore += (firstRoll + secondRoll);
      } else if (isSpare) {
        totalScore += firstRoll;
      }
      
      // Calculate whether there is strike or spare that will be utilized in next frame.
      isStrike = false;
      isSpare = false;

      if ((firstRoll === 10 && secondRoll === 0)
        || (firstRoll === 0 && secondRoll === 10)) {
        isStrike = true;
      } else if (firstRoll + secondRoll === 10) {
        isSpare = true;
      }
    }

    return totalScore;
  }

  /** Checks whether argument provided is of a number type. */
  private isNumeric(possibleNumber?: string | number): boolean {
    return possibleNumber != null
      && possibleNumber !== ''
      && !isNaN(Number(possibleNumber));
  }
}
