import { Component } from '@angular/core';
import { User } from '../../Interfaces/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  user: User;

  constructor(
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem("user")!);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(["/login"]);
  }

}