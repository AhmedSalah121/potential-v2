import {
  Body,
  Controller,
  NotImplementedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  login(
    @Body() input: { username: string; password: string },
  ): ReturnType<AuthService['authenticate']> {
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request: any) {
    return request.user;
  }
}
