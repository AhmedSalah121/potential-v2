import { Body, Controller, UseGuards, Request } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  login(
    @Body() input: { username: string; password: string },
  ): ReturnType<AuthService['authenticate']> {
    return this.authService.authenticate(input);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request: any) {
    return request.user;
  }
}
