import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, dto: CreateProductDto) {
    const { categoryId, ...productData } = dto;

    return this.prismaService.product.create({
      data: {
        ...productData,
        user: {
          connect: { id: userId },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  findAll(limit = 10, offset = 0) {
    return this.prismaService.product.findMany({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: string) {
    return this.prismaService.product.findUnique({
      where: { id },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      data: updateProductDto,
      where: { id },
    });
  }

  async remove(id: string, userId: any) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId === userId) {
      return this.prismaService.product.update({
        where: { id },
        data: { isActive: false },
      });
    }

    throw new ForbiddenException(
      'You are not authorized to delete this product',
    );
  }

  async search(name: string, limit = 10, offset = 0) {
    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: offset,
      }),
      this.prismaService.product.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
