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

          // marker
          const marker = L.marker([this.lat, this.lon]).addTo(this.mymap);

          const baseMaps = {
            "Osm": OpenStreetMap_Mapnik
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

