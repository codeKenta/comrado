import { Pipe, PipeTransform } from '@angular/core';

// Pipe for filtering an array by keyword search

@Pipe({
  name: 'filterByUsername'
})
export class FilterPipe implements PipeTransform {

  transform(users: any, search: any): any {
    // Check if there is any searchwords
    if(search === undefined) return users;
     return users.filter(function(users) {
       return users.username.toLowerCase().includes(search.toLowerCase());
    })
  }

}
