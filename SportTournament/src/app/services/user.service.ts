import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './global.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public rute: String;
  public token;
  public identity;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(public _http: HttpClient){
    this.rute = GLOBAL.url
  }

  register(user: User):Observable<any>{
    let params = JSON.stringify(user);
    return this._http.post(this.rute+'/user/save',params,{headers:this.headersVariable})
  }

  login(user, getToken = null):Observable<any>{
    if (getToken != null) {
      user.getToken = getToken
    }
    let params = JSON.stringify(user);
    return this._http.post(this.rute+'/user/login',params,{headers: this.headersVariable})
  }

  getToken() {
    var token2 = localStorage.getItem('token');
    if (token2 != 'undefined') {
      this.token = token2;
    } else {
      this.token = null;
    }
    return this.token;
  }

}
