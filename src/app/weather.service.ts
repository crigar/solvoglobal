import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  configUrl: string = 'https://api.openweathermap.org/data/2.5/';
  api_key: string = '6b437d0f77f8a46e5d8715e8505e9954';
  

  notificationSubject: Subject<any>;
  userAuthSubject: Subject<any>;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { 
    this.notificationSubject = new Subject();
    this.userAuthSubject = new Subject();
  }

  getWeatherByCity(cityName: string) {
    let url =  `${this.configUrl}weather?q=${cityName}&appid=${this.api_key}&units=metric`;
    return this.http.get<any>(url);
  }

  get3HourForecast5days(cityName: string) {
    let url =  `${this.configUrl}forecast?q=${cityName}&appid=${this.api_key}&units=metric`;
    return this.http.get<any>(url);
  }

  getUsers() {
    let users: any = localStorage.getItem('users');
    if (users) {
      users = JSON.parse(users);
    } else {      
      users =  {};
    }
    return users;
  }

  getUserAuth() {
    let userAuth = localStorage.getItem('userAuth');
    return userAuth ? JSON.parse(userAuth): {};
  }

  closeSession() {
    this.userAuthSubject.next(false);
    localStorage.removeItem('userAuth');
  }

  setUserCities(cities: any ) {
    let userAuth = this.getUserAuth();
    userAuth['cities'] = cities;
    let users = this.getUsers();
    users[userAuth.user] = userAuth;
    console.log('asdf', users)
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userAuth', JSON.stringify(userAuth));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
    });
  }
}
