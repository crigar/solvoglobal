import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { InfoWeather } from '../interfaces/info-weather';

@Component({
  selector: 'app-citycard',
  templateUrl: './citycard.component.html',
  styleUrls: ['./citycard.component.scss']
})
export class CitycardComponent implements OnInit {

  @Input() data: InfoWeather = {name: '', main: '', weather: '', wind: ''};
  @Input() isSearch: boolean = false;
  @Output() add: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAdd() {
    this.add.emit(this.data.name);
  }

}
