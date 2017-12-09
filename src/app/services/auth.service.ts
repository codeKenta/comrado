import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/register', user, { headers: headers })
      .map(res => res.json());
   }

   authenticateUser(user) {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     return this.http.post('users/authenticate', user, { headers: headers })
       .map(res => res.json());
   }

   storeUserData(token, user){
     localStorage.setItem('id_token', token);
     localStorage.SetItem('user', JSON.stringify(user));
     this.authToken = token;
     this.user = user;
   }

   signOut(){
     this.authToken = null;
     this.user = null;
     localStorage.clear();
   }

}
