import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import {
  GenericDialogComponent,
  GenericDialogData,
} from '../../shared/components/generic-dialog/generic-dialog.component';
import { filter, Observable } from 'rxjs';

export interface GenericDialogOptions<TComponent = unknown, TData = unknown> {
  component: Type<TComponent>;
  title?: string;
  data?: TData;
  showCloseButton?: boolean;
  config?: MatDialogConfig<GenericDialogData<TData>>;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  openComponent<TComponent = unknown, TData = unknown, TResult = unknown>(
    options: GenericDialogOptions<TComponent, TData>,
  ): Observable<TResult> {
    const dialogData: GenericDialogData<TData> = {
      component: options.component,
      title: options.title,
      data: options.data,
      showCloseButton: false,
    };

    const config: MatDialogConfig<GenericDialogData<TData>> = {
      ...options.config,
      data: dialogData,
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, config);
    return dialogRef.afterClosed().pipe(filter((result): result is TResult => !!result));
  }
}
