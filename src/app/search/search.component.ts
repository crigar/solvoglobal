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
  monitor: { [key: string]: any } = {};

  setStep(index: number) {
    this.step = index;
  }

  private notificationSub: Subscription;

  constructor(private weatherService: WeatherService, private _snackBar: MatSnackBar) {
    this.notificationSub = new Subscription();
  }

  ngOnInit(): void {
    this.notificationSub = this.weatherService.notificationSubject.subscribe((data: any ) => {
      console.log(data)
      const text = `${data.forecast.dt_txt} - ${data.city} ${data.forecast.main.temp} °C, ${data.forecast.weather[0].main}`;
      this.openSnackBar(text, 'cerrar');

    });
  }

  ngOnDestroy(): void {
    this.notificationSub.unsubscribe();
  }


  search() {
    this.weatherService.getWeatherByCity(this.value).subscribe((data: any) => {
      this.data = data;
    });
  }

  add(cityName: string) {
    this.weatherService.get3HourForecast5days(cityName).subscribe((data: any) => {
      const setForecast = (cityForecast: any) => {
        for (const forecast of data.list) {
          if (!cityForecast[forecast.dt_txt]) {
            cityForecast[forecast.dt_txt] = forecast;
          }
        }
        this.weatherService.notificationSubject.next({ city: cityName, forecast: data.list[0] });
        this.monitor[cityName] = cityForecast;
      }
      if (!this.monitor[cityName]) {
        const forecastList: { [key: string]: any } = {};
        setForecast(forecastList);
        this.cities.push(this.data);
        if (!this.monitor[cityName]['users']) this.monitor[cityName].users = [];
      } else {
        setForecast(this.monitor[cityName]);
      }
      console.log(this.cities)
    });

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
    });
  }

  getForecast(cityName: string) {
    return Object.keys(this.monitor[cityName]);
  }

}
