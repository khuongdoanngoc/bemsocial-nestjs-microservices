import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.getUsers')
  getUsers(): UserDto[] {
    return this.usersService.getUsers();
  }
}
