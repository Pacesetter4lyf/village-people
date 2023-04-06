import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    const subObj = {
      next: (resData: AuthResponseData) => {
        console.log(resData);
        this.authService.signedIn = true;
        this.authService.signedInEmitter.next(this.authService.signedIn);
        this.router.navigate(['individual']);
        this.error = null;
      },
      error: (error: Error) => {
        console.log(error);
        this.error = error.message;
      },
    };

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe(subObj);
    } else {
      this.authService.signup(email, password).subscribe(subObj);
    }

    this.isLoading = false;
    form.reset();
  }
}
