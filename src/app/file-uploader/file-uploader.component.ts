import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {

  fileName = '';
  rawFile = '';
  errorMessage = "";
  uploadProgressPerc: number | null = null;
  parsingSub: Subscription | null = null;

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    this.reset();

    if (!file) {
      return;
    }

    if (!this.isValidFileExtension(file)) {
      console.log(file);
      this.errorMessage = "Nieprawidłowy format pliku. Proszę przesłać plik txt."
      return;
    }

    this.fileName = file.name;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.rawFile = fileReader.result as string;
      console.log(fileReader.result);
    }
    fileReader.onerror = (event) => {
      this.errorMessage = "Niemożna było przesłąć pliku";
    }

    fileReader.readAsText(file);

    // TODO: Add parser service and subscribe      
  }

  cancelUpload() {
    this.parsingSub?.unsubscribe();
    this.reset();
  }

  private reset(): void {
    this.fileName = '';
    this.rawFile = '';
    this.errorMessage = "";
  }

  private isValidFileExtension(file: File): boolean {
    const extension = file.name.split('.').pop(); 
    return extension === "txt";
  }
}
