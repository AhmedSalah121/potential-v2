import {IsString, IsEmail, IsPhoneNumber} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber("EG")
  phone: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
