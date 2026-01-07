import { Body, Controller, UseGuards, Request } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): ReturnType<AuthService['authenticate']> {
    return this.authService.authenticate(loginUserDto);
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
