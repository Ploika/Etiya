import { Pipe, PipeTransform } from '@angular/core';
import {IFullUser} from "../models/fullUser";

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: IFullUser[], search: string = ''): IFullUser[] {
    if(!search.trim()) {
      return users
    }

    return users.filter(user => {
      return user.firstName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
             user.lastName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
             user.userName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
             user.phone.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
             user.email.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    });
  }

}
