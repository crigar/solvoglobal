import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  signUpForm: FormGroup;
  secretKey = "YourSecretKeyForEncryption&Descryption";
  loginActived: boolean = true;
  isAuth: boolean = true;

  constructor(private weatherService: WeatherService) { 
    this.login = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
    });

    this.signUpForm = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    
  }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  signUp() {
    const passEncrypted = this.encrypt(this.signUpForm.controls['pass'].value);
    let users = this.weatherService.getUsers();
    users[this.signUpForm.controls['user'].value] = passEncrypted;
    localStorage.setItem('users', JSON.stringify(users));
  }

  signIn() {
    let users = this.weatherService.getUsers();
    let pass = users[this.login.controls['user'].value];
    console.log(pass)
    console.log(this.decrypt(pass))
    console.log(this.login.controls['pass'].value)
    if (this.decrypt(pass) === this.login.controls['pass'].value) {
        console.log('igual')
        this.isAuth = true;
    } else {
      console.log(' no igual')
    }
  }

}
