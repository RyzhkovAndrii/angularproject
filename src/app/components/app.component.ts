import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../modules/app-security/services/authentication.service';
import { User } from '../modules/app-security/models/user.model';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  isCollapsed = false;

  isLoggedIn = false;

  currentUser: User;

  constructor(
    private authService: AuthenticationService,
    private router: Router

  ) { }

  ngOnInit() {
  }

  onActivate(elementRef) {
    if (elementRef.login !== undefined) {
      elementRef.login
        .subscribe(() => {
          this.isLoggedIn = true;
          this.currentUser = this.authService.getCurrentUser();
          this.router.navigate(['/']);
        });
    }
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
  }

}
