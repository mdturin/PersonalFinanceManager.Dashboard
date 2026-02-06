import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { SideNavService } from '../../../services/side-nav.service';
import { NavItem, SideNavConfig } from '../../../models/side-nav.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  imports: [CommonModule, RouterLink]
})
export class SideNavComponent implements OnInit {
  currentNavItem: NavItem | null = null;
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
          this.currentNavItem = this.findActiveNavItem(config);
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

  private findActiveNavItem(config: SideNavConfig): NavItem | null {
    for (const section of config.sections) {
      for (const item of section.items) {
        if (item.active) {
          return item;
        }
      }
    }

    return null;
  }

  onNavItemClick(item: NavItem): void {
    if(this.currentNavItem)
      this.currentNavItem.active = false; // Deactivate current item

    item.active = true; // Activate clicked item
    this.currentNavItem = item; // Update current active item
  }

  onCardButtonClick(action: string): void {
    console.log('Card button clicked with action:', action);
    // Implement button action logic here
  }
}
