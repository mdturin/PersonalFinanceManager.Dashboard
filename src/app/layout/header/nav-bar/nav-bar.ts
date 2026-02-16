import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  imports: [RouterLink],
})
export class NavBarComponent {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
