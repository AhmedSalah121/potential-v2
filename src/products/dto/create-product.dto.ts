import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  categoryId: string;
}
