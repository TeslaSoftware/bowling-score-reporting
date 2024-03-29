import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Subscription, Subject, timer } from 'rxjs';
import { ParsingService } from '../parsing-service.service'
import { takeUntil } from "rxjs/operators"

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  private parsingSub: Subscription | null = null;
  private componentDestroyed$: Subject<boolean> = new Subject()

  fileName = '';
  textData = '';
  errorMessage = "";
  isUploading = false;

  constructor(private parsingService: ParsingService) { }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    this.reset();

    if (!file) {
      return;
    }

    if (!this.isValidFileExtension(file)) {
      this.errorMessage = "Nieprawidłowy format pliku. Proszę przesłać plik txt."
      return;
    }

    this.isUploading = true;
    this.fileName = file.name;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.textData = fileReader.result as string;
      const isParsingValid$ = this.parsingService.parseTextToData(this.textData);
      isParsingValid$.pipe(takeUntil(this.componentDestroyed$))
        .subscribe((result) => this.handleParsingResult(result));
    }

    fileReader.onerror = () => {
      this.errorMessage = "Niemożna było przesłąć pliku";
    }

    fileReader.readAsText(file);    
  }

  private reset(): void {
    this.fileName = '';
    this.textData = '';
    this.errorMessage = "";
    this.isUploading = false;
  }

  private isValidFileExtension(file: File): boolean {
    const extension = file.name.split('.').pop();
    return extension === "txt";
  }

  private handleParsingResult(parsingError: string) {
    if (parsingError) {
      this.errorMessage = parsingError;
    }

    // Opóźnij uaktualnienie zmiennej aby pokazać pasek łądowania
    timer(500).subscribe(() => this.isUploading = false);
  }
}
