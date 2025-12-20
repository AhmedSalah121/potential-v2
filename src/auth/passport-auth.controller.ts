import {
  Get,
  Post,
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from './guards/passport-auth.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('login')
  login(@Request() request: any): ReturnType<AuthService['signIn']> {
    return this.authService.signIn(request.user);
  }

  @UseGuards(PassportJwtGuard)
  @Get('me')
  getUserInfo(@Request() request: any) {
    return request.user;
  }
}
