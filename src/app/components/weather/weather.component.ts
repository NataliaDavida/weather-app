import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { Map } from 'leaflet'

declare const L: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})

export class WeatherComponent implements OnInit {
  lat: any;
  lon: any;
  weather: any;
  map!: Map;
  @ViewChild('map', {static: true}) mapRef!: ElementRef;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {

   this.getLocation();

  //  MAP___________________________________________________
  
  navigator.geolocation.getCurrentPosition((success) => {
         
    this.lat = success.coords.latitude;
    this.lon = success.coords.longitude;
  
    this.map = L.map(this.mapRef.nativeElement).setView([this.lat, this.lon], 3);
    
    const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
    });
    OpenStreetMap_Mapnik.addTo(this.map)

    const Temp = L.tileLayer('http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=a039bd65da6c87797daeedb7819fd320', {
      maxZoom: 3,
    }),

    Wind = L.tileLayer('http://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=a039bd65da6c87797daeedb7819fd320', {
       maxZoom: 3,
    }),

    Pressure = L.tileLayer('http://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=d22d9a6a3ff2aa523d5917bbccc89211', {
       maxZoom: 3,
    }),

    Clouds = L.tileLayer('http://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=d22d9a6a3ff2aa523d5917bbccc89211', {
      maxZoom: 3,
    });  

    const baseMaps = {
       "Osm": OpenStreetMap_Mapnik,
    };
    
    const overlayMaps = {
      "Temperature": Temp,
       "Clouds": Clouds, 
       "Pressure": Pressure, 
       "Wind": Wind
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    L.Control.geocoder().addTo(this.map);
    L.marker([this.lat, this.lon]).addTo(this.map)

  });
  
}
   getLocation(){
     if('geolocation' in navigator) {
       navigator.geolocation.watchPosition((success)=>{
         this.lat = success.coords.latitude;
         this.lon = success.coords.longitude;
         
         this.weatherService.getWeatherData(this.lat, this.lon).subscribe(weather => {
            this.weather = weather
            console.log(weather)
      
         })
       
       })
     }
   }

   getCity(city: string) {
     this.weatherService.getCoords(city).subscribe((data: any)=> {
       this.weather = data;
       this.map.setView([data.coord.lat, data.coord.lon], 10);
      
       L.marker([data.coord.lat, data.coord.lon]).addTo(this.map)     
      })

   }

}

