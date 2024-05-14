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

  /**
   * Executes on initialization and subscribes for getting the role.
   */
  ngOnInit(): void {
    this.authService.extractAndSetRole()
    this.authService.getRole().subscribe(role => {
      this.role = role;
    })
  }

  /**
   * Logs out the user.
   */
  logout(): void {
    this.authService.logout();
  }

}
