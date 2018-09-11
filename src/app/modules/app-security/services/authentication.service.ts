import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

import { User } from '../../app-users/models/user.model';
import { SecurityModuleUrlService } from './security-module-url.service';
import { Observable } from '../../../../../node_modules/rxjs';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { AppModalService } from '../../app-shared/services/app-modal.service';
import { TokenResponse } from '../models/token-response.model';

@Injectable()
export class AuthenticationService {

    private storage: Storage = localStorage;

    constructor(
        private http: HttpClient,
        private urlService: SecurityModuleUrlService,
        private appModalService: AppModalService
    ) { }

    readonly ACCESS_TOKEN_NAME = 'access_token';
    readonly REFRESH_TOKEN_NAME = 'refresh_token';
    readonly USER_NAME = 'user';

    login(username: string, password: string): Observable<TokenResponse> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const body = `username=${username}&password=${password}`;
        return this.http
            .post(this.urlService.loginUrl, body, {
                headers: headers
            })
            .catch(httpErrorHandle);
    }

    recieveCurrentUserInfo(): Observable<User> {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.getAccessToken());
        return this.http
            .get(this.urlService.currentUserUrl, { headers: headers })
            .catch(err => this.appModalService.openHttpError(err));
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
    }

    getAccessToken(): string {
        console.log(this.storage.getItem(this.ACCESS_TOKEN_NAME));
        return this.storage.getItem(this.ACCESS_TOKEN_NAME);
    }

    getRefreshToken(): string {
        return this.storage.getItem(this.REFRESH_TOKEN_NAME);
    }

    setToken(tokenResp: TokenResponse): void {
        this.storage.setItem(this.ACCESS_TOKEN_NAME, tokenResp.accessToken);
        this.storage.setItem(this.REFRESH_TOKEN_NAME, tokenResp.refreshToken);
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        if (!decoded.exp) {
            return null;
        }
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token: string): boolean {
        if (!token) {
            return true;
        }
        const date = this.getTokenExpirationDate(token);
        return date ? date.valueOf() < new Date().valueOf() : true;
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        return !this.isTokenExpired(token);
    }

    getCurrentUser(): User {
        return JSON.parse(this.storage.getItem(this.USER_NAME));
    }

    setCurrentUser(user: User) {
        this.storage.setItem(this.USER_NAME, JSON.stringify(user));
    }

    changeCurrentUserPassword(password: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const body = `password=${password}`;
        return this.http
            .post(this.urlService.changePasswordUrl, body, {
                headers: headers,
                responseType: 'text'
            })
            .catch(err => this.appModalService.openHttpError(err));
    }

    setStorage(storage: Storage) {
        this.storage = storage;
    }

}
