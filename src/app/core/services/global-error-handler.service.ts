import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  private notificationService = inject(NotificationService);

  handleError(error: unknown): void {
    const message = this.resolveMessage(error);
    this.notificationService.error(message);
  }

  private resolveMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Unexpected error occurred. Please try again.';
  }
}
