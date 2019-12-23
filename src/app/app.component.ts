import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngapp-complete-guide';
  activeMenu: string;
  constructor() {
    this.activeMenu = 'recipe';
  }
  onNavLinkClicked(linkName: string) {
    this.activeMenu = linkName;
  }
}
