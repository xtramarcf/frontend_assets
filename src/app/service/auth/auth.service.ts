import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable} from "rxjs";
import {environment} from "../../utility/environment";
import {RegisterRequest} from "../../view/register/register.component";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private roleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public role$: Observable<string | null> = this.roleSubject.asObservable();
  private baseUrl = environment.baseUrl;

  constructor(private router: Router,
              private helper: JwtHelperService,
              private http: HttpClient,
  ) {
  }

  setRole(role: string | null): void {
    this.roleSubject.next(role);
  }

  getRole(): Observable<string | null> {
    return this.role$;
  }


  logout(): void {
    this.http.get<any>(`${this.baseUrl}/auth/logout`)
    this.setRole(null);
    if (typeof localStorage !== 'undefined') {
      localStorage?.removeItem('access_token')
    }
    this.router.navigate(["/login"]);
  }


  extractAndSetRole(): void {
    const token = localStorage.getItem('access_token')
    const decodedToken = this.helper.decodeToken(token ?? '');
    if (decodedToken) {
      this.setRole(decodedToken.role);
    }
  }


  authenticate(userName: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/authenticate`, {userName, password})
  }


  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, registerRequest)
  }


}
