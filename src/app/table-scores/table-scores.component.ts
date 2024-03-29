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


@Component({
  selector: 'app-table-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table-scores.component.html',
  styleUrl: './table-scores.component.scss'
})
export class TableScoresComponent {
  private componentDestroyed$: Subject<boolean> = new Subject()
  baseColumns: string[] = ['playerName', 'totalScore'];
  scoreColumns: string[] = Array.from({length: 22}, (v, k) => 'Rzut ' + (k+1)); 
  displayedColumns: string[] = this.baseColumns.concat(this.scoreColumns);
  dataSource = new MatTableDataSource<IBowlingResult>([]);  
  paginator!: MatPaginator;
  
  bowlingResults: IBowlingResult[] = [];

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
        this.bowlingResults = updatedBowlingResults;
        this.dataSource.data = updatedBowlingResults;
      });

      
  }

  ngAfterViewInit() {
    this.setDataSourceAttributes();
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

  private setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
