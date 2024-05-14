import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";

/**
 * Component for user login page.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  userName: string = "";
  password: string = "";

  message: string = "Test";
  messageType = "";
  role: string | null = null;


  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  /**
   * On initialization sets the role of the user.
   */
  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    })
  }

  /**
   * Logs in the user. Gives feedback, if the user is not enabled or the credentials are invalid.
   */
  loginUser() {
    this.authService.authenticate(this.userName, this.password).subscribe({
        next: response => {
          localStorage.setItem("access_token", response.access_token);
          this.authService.extractAndSetRole()
          this.router.navigate(['/home']);
        },
        error: error => {

          if (error.status === 401 || error.status === 400) {
            this.messageType = "danger"
            this.message = "Invalid credentials or account is not enabled yet."
          } else {
            this.messageType = "danger";
            this.message = "Server Error";
          }
        }
      }
    )
  }
}
