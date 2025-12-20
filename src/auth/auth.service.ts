import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {PrismaService} from "../prisma/prisma.service";

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

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

    async findUserByName(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async createUser(data: CreateUserDto) {
        return this.prisma.user.create({
            data,
        });
    }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(authInput: AuthInput): Promise<SignInData | null> {
    const user = await this.findUserByName(authInput.username);
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
    const existingUser = await this.findUserByName(
      createUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.signIn({ userId: newUser.id, username: newUser.username });
  }
}
