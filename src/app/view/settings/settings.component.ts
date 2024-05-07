import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../utility/environment";
import {Subject} from "rxjs";


interface User {
  userName: string,
  firstName: string,
  lastName: string,
  enabled: boolean
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  baseUrl = environment.baseUrl;

  private _users$ = new Subject<User[]>();
  users$ = this._users$.asObservable()


  constructor(private http: HttpClient) {
  }


  ngOnInit(): void {
    this.loadUser()
  }


  loadUser(): any {
    this.http.get<any>(`${this.baseUrl}/users/get-all`).subscribe({
      next: response => {
        this._users$.next(response)
      }
    })
  }


  enableUser(userName: string): any {
    const params = new HttpParams().set('userName', userName);
    this.http.post<any>(`${this.baseUrl}/users/enable`, {}, {params}).subscribe({
      next: () => {
        this.loadUser()
      }
    })

  }


  deleteUser(userName: string): any {
    const params = new HttpParams().set('userName', userName);
    this.http.delete<any>(`${this.baseUrl}/users/delete`, {params}).subscribe({
      next: () => {
        this.loadUser()
      }
    })
  }

}

