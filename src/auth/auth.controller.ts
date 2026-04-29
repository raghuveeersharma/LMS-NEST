import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterDto) {
    console.log('registerUserDto', registerUserDto);
    const result = this.authService.registerUser();
    return result;
  }
}
