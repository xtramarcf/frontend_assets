import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";


export interface RegisterRequest {
  userName: string,
  firstName: string,
  lastName: string,
  password: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      userName: ["", Validators.required],
      password: ["", [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{10,}$")]],
      confirmPassword: ["", [Validators.required]]
    }
  );

  message: string = "";
  messageType: string = "";

  role: string | null = null;


  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
        this
          .role = role;
      }
    )
  }

  validate(): boolean {
    this.messageType = "warning"

    if (
      this.registerForm.get('userName')?.hasError('required') ||
      this.registerForm.get('firstName')?.hasError('required') ||
      this.registerForm.get('lastName')?.hasError('required') ||
      this.registerForm.get('password')?.hasError('required') ||
      this.registerForm.get('confirmPassword')?.hasError('required')
    ) {
      this.message = "Please fill out all fields."
      return false
    } else if (this.registerForm.get('password')?.hasError('pattern')) {
      this.message = "The password must be at least 10 characters long and must contain at least one digit, one lowercase letter, one uppercase letter, and one special character."
      return false
    } else if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.message = "Passwords does not match."
      return false
    } else {
      this.messageType = ''
      this.message = ""
      return true
    }
  }


  registerUser() {

    if (!this.validate()) {
      return
    }

    const registerRequest: RegisterRequest = {
      userName: this.registerForm.value.userName!,
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      password: this.registerForm.value.password!
    }

    console.log(registerRequest)

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.messageType = "success";
        this.message = "Registered. After enabling the account by the Admin, you can login. Please wait.";
      },
      error: error => {
        this.messageType = "danger";

        switch (error.status) {
          case 400:
            this.message = "Missing Fields or insecure password."
            break
          case 409:
            this.message = "Username already exists."
        }
      }
    });
  }
}

