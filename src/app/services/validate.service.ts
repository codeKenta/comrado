import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateUserDetails(user){
    if( user.username == undefined || user.password == undefined ) {
      return false;
    } else {
      return true;
    }
  }

}
