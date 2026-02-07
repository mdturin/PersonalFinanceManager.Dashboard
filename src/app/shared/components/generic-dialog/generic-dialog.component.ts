import { CommonModule } from '@angular/common';
import { Component, Injector, Type, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface GenericDialogData<T = unknown> {
  title?: string;
  component: Type<unknown>;
  data?: T;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-generic-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent {
  private injector = inject(Injector);
  dialogData = inject<GenericDialogData>(MAT_DIALOG_DATA);

  contentInjector = Injector.create({
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: this.dialogData.data
      }
    ],
    parent: this.injector
  });

  get showCloseButton(): boolean {
    return this.dialogData.showCloseButton ?? true;
  }
}
