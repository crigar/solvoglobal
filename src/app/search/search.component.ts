import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from '../weather.service';
import {MatSnackBar, MatSnackBarHorizontalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  value = '';
  data: any;
  step = 0;
  cities: any[] = [];
  userAuth: any = {};

  setStep(index: number) {
    this.step = index;
  }

  private notificationSub: Subscription;

  constructor(private weatherService: WeatherService) {
    this.notificationSub = new Subscription();
  }

  ngOnInit(): void {
    this.notificationSub = this.weatherService.notificationSubject.subscribe((data: any ) => {
      const text = `${data.forecast.dt_txt} - ${data.city} ${data.forecast.main.temp} °C, ${data.forecast.weather[0].main}`;
      this.weatherService.openSnackBar(text, 'cerrar');

    });
    this.userAuth = this.weatherService.getUserAuth();
    this.cities = this.userAuth.cities;
  }

  ngOnDestroy(): void {
    this.notificationSub.unsubscribe();
  }


  search() {
    this.weatherService.getWeatherByCity(this.value).subscribe((data: any) => {
      this.data = data;
    });
  }

  addCity(cityName: string) {
    let cityAdded = false;
    for (const city of this.cities) {
      if (city.name === cityName) cityAdded = true;
    }
    if (!cityAdded) this.cities.push(this.data);
  }

  add(cityName: string) {
    this.weatherService.get3HourForecast5days(cityName).subscribe((data: any) => {
      this.data['forecast'] = data.list;
      this.addCity(cityName);
      this.weatherService.setUserCities(this.cities);
      this.weatherService.notificationSubject.next({ city: cityName, forecast: data.list[0] });
      this.data = '';
    });

  }

  getForecast(cityName: string) {
    return Object.keys(this.data);
  }

  close() {
    this.weatherService.closeSession();
  }

}
