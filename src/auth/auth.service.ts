import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

interface AuthInput {
  username: string;
  password: string;
}

interface SignInData {
  userId: number;
  username: string;
}

interface AuthResult {
  accessToken: string;
  userId: number;
  username: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  validateUser(authInput: AuthInput): SignInData | null {
    const user = this.usersService.findUserByName(authInput.username);
    if (user && user.password === authInput.password) {
      return { userId: user.userId, username: authInput.username };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const payload = {
      sub: user.userId,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      userId: user.userId,
      username: user.username,
    };
  }
}
