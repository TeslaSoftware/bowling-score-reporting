import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Subject, timer } from 'rxjs';
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

    const fileExtension = this.getFileExtension(file)
    if (fileExtension !== 'txt') {
      this.errorMessage = `Nieprawidłowy format pliku! Plik ma rozszerzenie ${fileExtension}. Proszę przesłać plik z rozszerzeniem txt.`
      return;
    }

    this.isUploading = true;
    this.fileName = file.name;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const textData = fileReader.result as string;
      this.parsingService.parseTextToData(textData)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((result) => this.handleParsingResult(result));
    }

    fileReader.onerror = () => {
      this.errorMessage = "Niemożna było przesłąć pliku";
    }

    fileReader.readAsText(file);
  }

  /** Reset values to their defaults. */
  private reset(): void {
    this.fileName = '';
    this.errorMessage = "";
    this.isUploading = false;
  }

  /** Returns file extension. */
  private getFileExtension(file: File): string {
    return file.name.split('.').pop() + '';
  }

  private handleParsingResult(parsingError: string) {
    if (parsingError) {
      this.errorMessage = parsingError;
    }

    // Opóźnij uaktualnienie zmiennej aby pokazać pasek łądowania
    timer(500).subscribe(() => this.isUploading = false);
  }
}
