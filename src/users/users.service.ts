import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// TODO: Make sure that the return type is a promise of User
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
