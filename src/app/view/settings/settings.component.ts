import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../utility/environment";
import {Subject} from "rxjs";

/**
 * Definition for user data.
 */
interface User {
  userName: string,
  firstName: string,
  lastName: string,
  enabled: boolean
}

/**
 * Component for administrating users.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {


  private _users$ = new Subject<User[]>();
  users$ = this._users$.asObservable()


  constructor(private http: HttpClient) {
  }


  /**
   * Loads all users on init.
   */
  ngOnInit(): void {
    this.loadUser()
  }


  /**
   * Loading users.
   */
  loadUser(): any {
    this.http.get<any>(`${environment.baseUrl}/iam/get-all-user`).subscribe({
      next: response => {
        this._users$.next(response)
      }
    })
  }


  /**
   * Enables a user by its username.
   * @param userName of the user, which will be enabled.
   */
  enableUser(userName: string): any {
    const params = new HttpParams().set('userName', userName);
    this.http.post<any>(`${environment.baseUrl}/iam/enable-user`, {}, {params}).subscribe({
      next: () => {
        this.loadUser()
      }
    })

  }


  /**
   * Deletes a user by its username.
   * @param userName of the user, which will be deleted.
   */
  deleteUser(userName: string): any {
    const params = new HttpParams().set('userName', userName);
    this.http.delete<any>(`${environment.baseUrl}/iam/delete-user`, {params}).subscribe({
      next: () => {
        this.loadUser()
      }
    })
  }

}

