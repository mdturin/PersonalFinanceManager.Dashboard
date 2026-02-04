export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SideNavConfig {
  sections: NavSection[];
  cards?: {
    title: string;
    body: string;
    buttonLabel: string;
    buttonAction: string;
    hidden?: boolean;
  }[];
}
