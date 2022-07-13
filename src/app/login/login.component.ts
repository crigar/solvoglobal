import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
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
  isAuth: boolean = false;

  private userAuthSub: Subscription;

  constructor(private weatherService: WeatherService, private _snackBar: MatSnackBar) { 
    this.login = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
    });

    this.signUpForm = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
    });
    this.userAuthSub = new Subscription();
  }

  ngOnInit(): void {
    this.userAuthSub = this.weatherService.userAuthSubject.subscribe((data: any ) => {
      this.isAuth = data;
      this.weatherService.openSnackBar('Session closed ¡thank you!', 'cerrar');
    });
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
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
    users[this.signUpForm.controls['user'].value] = { pass: passEncrypted, cities: [] };
    console.log(users)
    localStorage.setItem('users', JSON.stringify(users));
  }

  signIn() {
    let users = this.weatherService.getUsers();
    const user = this.login.controls['user'].value;
    let pass = users[user].pass;
    if (this.decrypt(pass) === this.login.controls['pass'].value) {
        this.isAuth = true;
        const userAuth = users[user];
        userAuth['user'] = user;
        localStorage.setItem('userAuth', JSON.stringify(userAuth));
    }
  }

}
