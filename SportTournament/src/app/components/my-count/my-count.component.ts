import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-count',
  templateUrl: './my-count.component.html',
  styleUrls: ['./my-count.component.css'],
  providers: [UserService]
})
export class MyCountComponent implements OnInit {

  constructor(
    public _userService: UserService,
  ) { }

  ngOnInit(): void {
  }

}
