import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavService } from '../../services/side-nav.service';
import { SideNavConfig, NavSection } from '../../models/side-nav.model';
import { delay, Observable } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  standalone: true,
  imports: [CommonModule]
})
export class SideNavComponent implements OnInit {
  config: SideNavConfig | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    // platform services
    private sideNavService: SideNavService,

    // angular services
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadSideNavConfig();
  }

  loadSideNavConfig(): void {
    this.sideNavService.getSideNavConfig()
      .subscribe({
        next: (config) => {
          this.config = config;
            this.loading = false;
            this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading side-nav config:', err);
          this.error = 'Failed to load navigation configuration';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onCardButtonClick(action: string): void {
    console.log('Card button clicked with action:', action);
    // Implement button action logic here
  }
}
