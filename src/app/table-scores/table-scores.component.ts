import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IBowlingResult } from '../ibowling-result'
import { ParsingService } from '../parsing-service.service'
import { takeUntil } from "rxjs/operators"
import { Subject } from 'rxjs';
import { MAX_ROLLS, MIN_FRAMES } from '../app.constants';


@Component({
  selector: 'app-table-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table-scores.component.html',
  styleUrl: './table-scores.component.scss'
})
export class TableScoresComponent {
  private readonly componentDestroyed$: Subject<boolean> = new Subject()
  private readonly ROLL_LABEL_REGEX = new RegExp(/^Rzut\s*\d{1,2}\s*\((\d{1,2})\)$/);
  baseColumns: string[] = ['playerName', 'totalScore'];
  scoreColumns: string[] = this.buildScoreColumns();
  frameHeaders: string[] = this.buildFrameHeaders();  
  groupHeaders: string[] = ['blank'].concat(this.frameHeaders);
  displayedColumns: string[] = this.baseColumns.concat(this.scoreColumns);

  dataSource = new MatTableDataSource<IBowlingResult>([]);  
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }  

  constructor(private parsingService: ParsingService) {}

  ngOnInit(): void {
    this.parsingService.getBowlingResults()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(updatedBowlingResults => {
        this.dataSource.data = updatedBowlingResults;
      });      
  }

  ngAfterViewInit() {
    this.setDataSourceAttributes();

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const regexResult = this.ROLL_LABEL_REGEX.exec(sortHeaderId);
      if (regexResult) {
        const index = Number(regexResult[1]) - 1;
        return data.scores[index];
      }
      return data[sortHeaderId as keyof typeof data];
    };
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

  /** Sets mat table data source attributes for sorting and pagination */
  private setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** 
   * Builds score column header names.
   * @example
   * Rzut 1 (7)
   * Where number in paranthesis is total number of rolls.
   */
  private buildScoreColumns() {
    return Array.from({length: MAX_ROLLS}, (v, k) => (k+1)).map(this.createScoreColumnName); 
  }

  private createScoreColumnName(rollNumber: number): string {
    const frameRollNumber = rollNumber % 2 == 0 ? 2 : 1;
    return `Rzut ${frameRollNumber} (${rollNumber})`
  }

  /** 
   * Builds frame header names.
   * @example
   * Runda 7 
   */
  private buildFrameHeaders(): string[]{
    return Array.from({length: MIN_FRAMES}, (v, k) => 'Runda ' + (k+1)).concat(['Runda Bonusowa']);
  }
}
