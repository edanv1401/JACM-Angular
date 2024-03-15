import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators';
import {environment} from '../../environment';
import jwt_decode from 'jwt-decode';

@Injectable({providedIn: 'root'})

export class Login implements OnInit {

  private userSubject: BehaviorSubject<any | null>;
  public user: Observable<any | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(localStorage.getItem('user'));
    this.user = this.userSubject.asObservable();
  }

  ngOnInit() {
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}user/authenticate`, {username, password})
      .pipe(map(user => {
        if (user.login === 1) {
          localStorage.setItem('user', user.message.token);
          this.userSubject.next(user.message.token);
        }
        return user;
      }));
  }

  decodeUserJwt(): any {
    try {
      return jwt_decode(this.userSubject.value);
    } catch (Error) {
      return {};
    }
  }

  tokenExpired() {
    if(!this.userValue) return true;
    const expiry = +this.decodeUserJwt().exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.emit();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  emit() {
    this.router.navigate(['/login']);
  }
}
