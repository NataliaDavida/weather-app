import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

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
  mymap: any;
 

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {

   this.getLocation();

  //  MAP___________________________________________________
  
  navigator.geolocation.getCurrentPosition((success) => {
         
          this.lat = success.coords.latitude;
          this.lon = success.coords.longitude;
  
          this.mymap = L.map('map').setView([this.lat, this.lon], 13);
    
          const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });
          OpenStreetMap_Mapnik.addTo(this.mymap)

          // snow
          const OpenSnowMap_pistes = L.tileLayer('https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & ODbL, &copy; <a href="https://www.opensnowmap.org/iframes/data.html">www.opensnowmap.org</a> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          });
       
          // wind
          const OpenWeatherMap_Wind = L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid={apiKey}', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
            apiKey: '<ACCESS_TOKEN=pk.eyJ1IjoibmF0YWRhdiIsImEiOiJja3d3Ymhybm8wMXp4MnByMDB6Y2l0dXR1In0.7gPxtqqKR-PvyxNSjOwbkw>',
            opacity: 0.5
          });

          // clouds
          const OpenWeatherMap_Clouds = L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
            apiKey: '<ACCESS_TOKEN>',
            opacity: 0.5
          });

          // marker
          const marker = L.marker([this.lat, this.lon]).addTo(this.mymap);

          const baseMaps = {
            "Osm": OpenStreetMap_Mapnik,
            "Snow": OpenSnowMap_pistes,
            "Wind": OpenWeatherMap_Wind,
            "Clouds": OpenWeatherMap_Clouds
        };
    
            const overlayMaps = {
            "Marker": marker
        };

    L.control.layers(baseMaps, overlayMaps).addTo(this.mymap);

    // L.Control.geocoder().addTo(this.mymap);

  });

  }
 


   getLocation(){
     if('geolocation' in navigator) {
       navigator.geolocation.watchPosition((success)=>{
         this.lat = success.coords.latitude;
         this.lon = success.coords.longitude;
         
         this.weatherService.getWeatherData(this.lat, this.lon).subscribe(data => {
            this.weather = data
      
         })
       
       })
     }
   }
  
   getCity(city: string) {
     this.weatherService.getCoords(city).subscribe((data: any)=> {
       this.weather = data;
       this.mymap.setView([data.coord.lat, data.coord.lon], 10);
      
     
     })
     L.marker([this.lat, this.lon]).addTo(this.mymap);
   }

}

