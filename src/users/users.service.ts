import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
}

const mockUsers: User[] = [
  {
    userId: 1,
    username: 'Mocked1',
    password: 'Mockedpassword',
  },
  {
    userId: 2,
    username: 'Mocked2',
    password: 'Mockedpassword',
  },
];

@Injectable()
export class UsersService {
  findUserByName(username: string): User | undefined {
    return mockUsers.find((user) => user.username === username);
  }
}
