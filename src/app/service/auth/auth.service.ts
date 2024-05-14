import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../utility/environment";
import {RegisterRequest} from "../../view/register/register.component";


/**
 * Service for iam operations.
 */
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

  /**
   * Sets the role of the user.
   * @param role role of the user.
   */
  setRole(role: string | null): void {
    this.roleSubject.next(role);
  }

  /**
   * Gets the role of the user.
   */
  getRole(): Observable<string | null> {
    return this.role$;
  }

  /**
   * Logs out the user by clearing the localStorage, resetting the role and navigating to log in.
   */
  logout(): void {
    this.http.get<any>(`${this.baseUrl}/iam/logout`)
    this.setRole(null);
    if (typeof localStorage !== 'undefined') {
      localStorage?.removeItem('access_token')
    }
    this.router.navigate(["/login"]);
  }

  /**
   * Extracts the role out of the jwt and sets it.
   */
  extractAndSetRole(): void {
    const token = localStorage.getItem('access_token')
    const decodedToken = this.helper.decodeToken(token ?? '');
    if (decodedToken) {
      this.setRole(decodedToken.role);
    }
  }

  /**
   * Authenticates the user by the userName and the password.
   * @param userName
   * @param password
   */
  authenticate(userName: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/iam/login`, {userName, password})
  }

  /**
   * Registers a user by his credentials.
   * @param registerRequest contains the user credentials.
   */
  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/iam/register`, registerRequest)
  }


}
