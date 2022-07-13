import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  configUrl: string = 'https://api.openweathermap.org/data/2.5/';
  api_key: string = '6b437d0f77f8a46e5d8715e8505e9954';
  

  notificationSubject: Subject<any>;

  constructor(private http: HttpClient) { 
    this.notificationSubject = new Subject();
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
}
