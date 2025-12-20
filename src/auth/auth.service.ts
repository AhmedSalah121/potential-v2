import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

interface AuthInput {
  username: string;
  password: string;
}

interface SignInData {
  userId: string;
  username: string;
}

export interface AuthResult {
  accessToken: string;
  userId: string;
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
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(authInput: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByName(authInput.username);
    if (user && (await bcrypt.compare(authInput.password, user.password))) {
      return { userId: user.id, username: authInput.username };
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

  async register(createUserDto: CreateUserDto): Promise<AuthResult> {
    const existingUser = await this.usersService.findUserByName(
      createUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.signIn({ userId: newUser.id, username: newUser.username });
  }
}
