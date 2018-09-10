import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() login = new EventEmitter<any>();

  showValidErr = false;
  showUserNotFound = false;
  showPassIncorrect = false;

  form: FormGroup = new FormGroup({
    'username': new FormControl(null, [Validators.required]),
    'password': new FormControl(null, [Validators.required]),
    'remember': new FormControl(false)
  });

  message: string;
  msgClass: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.logout();
    this.checkRouteMessage();
  }

  submit() {
    if (!this.form.valid) {
      this.showValidErr = true;
      return;
    }
    const { username, password, remember } = this.form.value;
    const storage = remember ? localStorage : sessionStorage;
    this.authService
      .login(username, password)
      .subscribe(
        token => {
          this.authService.setStorage(storage);
          this.authService.setToken(token);
          this.authService.recieveCurrentUserInfo()
            .subscribe(
              user => {
                this.authService.setCurrentUser(user);
                this.router.navigate(['/']);
              }
            );
        },
        (err: HttpErrorResponse) => {
          this.toggleErrMessages(JSON.parse(err.error).message);
        }
      );
  }

  private toggleErrMessages(message: string) {
    switch (message) {
      case 'User does not exist': {
        this.showUserNotFound = true;
        break;
      }
      case 'Password is incorrect': {
        this.showPassIncorrect = true;
        break;
      }
    }
  }

  private checkRouteMessage() {
    this.message = null;
    this.route.queryParams
      .subscribe(params => {
        if (params['authError']) {
          this.message = 'Ошибка авторизации';
          this.msgClass = 'alert-danger';
        } else if (params['passChange']) {
          this.message = 'Пароль успешно изменен';
          this.msgClass = 'alert-success';
        }
      });
  }

  resetFormShowErr() {
    this.showUserNotFound = false;
    this.showPassIncorrect = false;
  }

  goToPasswordChange() {
    this.router.navigate(['/auth/password/']);
  }

}
