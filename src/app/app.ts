import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { NavBarComponent } from './layout/header/nav-bar/nav-bar';
import { SideNavComponent } from './layout/sidebar/side-nav/side-nav';
import { LoaderService } from './core/services/loader.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, SideNavComponent, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private loaderService = inject(LoaderService);
  private authService = inject(AuthService);

  get loading$(): Observable<boolean> {
    return this.loaderService.loading$;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authService.isAuthenticated$;
  }
}
