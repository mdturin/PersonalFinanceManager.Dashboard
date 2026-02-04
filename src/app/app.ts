import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { SideNavComponent } from './components/side-nav/side-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, SideNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
