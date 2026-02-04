import { Component } from '@angular/core';
import { NavBarComponent } from './components/nav-bar/nav-bar';
import { SideNavComponent } from './components/side-nav/side-nav';

@Component({
  selector: 'app-root',
  imports: [NavBarComponent, SideNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
