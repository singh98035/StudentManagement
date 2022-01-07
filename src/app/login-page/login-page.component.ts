import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl } from '@angular/forms';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

loginform : any | undefined ;

  constructor(public db : DbService) { }

  ngOnInit(): void {
    
  this.loginform = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  }


  async onSubmit()
  {
    await this.db.loginUser(this.loginform.value);
  }

  
}
