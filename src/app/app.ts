import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { NavBarComponent } from './layout/header/nav-bar/nav-bar';
import { SideNavComponent } from './layout/sidebar/side-nav/side-nav';
import { LoaderService } from './core/services/loader.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, SideNavComponent, NgIf, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  get loading$(): Observable<boolean> {
    return this.loaderService.loading$;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authService.isAuthenticated$;
  }
}
