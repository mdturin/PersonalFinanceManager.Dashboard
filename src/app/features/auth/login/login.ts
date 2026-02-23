import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isSubmitting = false;
  loginErrorMessage: string | null = null;
  readonly loginForm;

  constructor() {
    const formBuilder = inject(FormBuilder);

    this.loginForm = formBuilder.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginErrorMessage = null;

    const { username, password } = this.loginForm.getRawValue();

    this.authService
      .login(username.trim(), password.trim())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe((errorMessage) => {
        if (errorMessage) {
          this.loginErrorMessage = errorMessage;
          this.notificationService.error(errorMessage);
        }
      });
  }
}
