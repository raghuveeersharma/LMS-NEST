import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    return await this.authService.registerUser(registerUserDto);
  }
}
