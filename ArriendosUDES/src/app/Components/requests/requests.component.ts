import { Component } from '@angular/core';
import { Request } from '../../Interfaces/request';
import { RequestService } from '../../Services/request.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {

  requestList: Request[];

  constructor(private requestService: RequestService) {
    this.getRequest()
  }

  getRequest() {
    this.requestService.getRequestList().subscribe({
      next: (data) => this.requestList = data,
      error: (ex) => window.alert(ex.messagge)
    });
  }
}