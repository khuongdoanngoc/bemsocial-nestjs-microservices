import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  getUsers(): UserDto[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        age: 25,
      },
      {
        id: '2',
        name: 'Jane Doe',
        age: 26,
      },
    ];
  }
}
