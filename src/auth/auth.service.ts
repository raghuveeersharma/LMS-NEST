import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerUser.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(registerUserDto: RegisterDto) {
    return this.userService.createUser(registerUserDto);
  }
}
