import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { User } from '../../Interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private router: Router
  ) {
    this.validateUser();
    this.formLogin = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  validateUser() {
    if(localStorage.getItem('user'))
      this.router.navigate(["/admin"]);
  }

  login() {
    this._loginService.login(this.formLogin.value.user, this.formLogin.value.password).subscribe({
      next: (data) => this.finallyLogin(data),
      error: (ex) => window.alert(ex.message)
    });
  }

  finallyLogin(data: User[]) {
    if (!data || data.length == 0) {
      window.alert('Usuario o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data[0]));
    this.router.navigate(["/admin"]);
  }

}