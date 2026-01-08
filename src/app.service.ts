import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  entry(): string {
    return 'Api Running 🚀';
  }

  ping(): string {
    return 'Pong 🏓';
  }
}
