import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, 'notification-success');
  }

  error(message: string): void {
    this.open(message, 'notification-error', 5000);
  }

  info(message: string): void {
    this.open(message, 'notification-info');
  }

  private open(message: string, panelClass: string, duration = 3500): void {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass,
    });
  }
}
