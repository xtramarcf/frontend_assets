import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-headnav',
  templateUrl: './headnav.component.html',
  styleUrl: './headnav.component.css'
})
export class HeadnavComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
  }

  role: string | null = null;

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    })
  }

  logout(): void {
    this.authService.logout();
  }

}
