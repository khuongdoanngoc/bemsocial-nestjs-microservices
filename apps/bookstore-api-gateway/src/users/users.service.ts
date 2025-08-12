import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  getUsers() {
    return this.usersClient.send('users.getUsers', {});
  }
}
