import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {


  constructor(private http: HttpClient) { }

  getWeatherData(lat: string, Ion: string): Observable<any> {
    let params= new HttpParams()
    .set('lat', lat)
    .set('lon', Ion)
    .set('appid', `${environment.API_KEY}`)

    return this.http.get<Observable<any>>(`${environment.BASE_URl}`, {params} )
  }
  getCoords(city: string): Observable<any> {
    let params = new HttpParams()
    .set('q', city)
    .set('appid', `${environment.API_KEY}`)

    return this.http.get<Observable<any>>(`${environment.BASE_URl}`, {params} )
  }


}
