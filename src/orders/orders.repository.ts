import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './enums/order-status.enum';
import { OrderStatus as OrderStatusDatabase } from '@prisma/client/';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    shippingAddress: string;
    totalAmount: number;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        shippingAddress: data.shippingAddress,
        totalAmount: data.totalAmount,
        items: {
          create: data.items,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(params: {
    where?: Prisma.OrderWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }) {
    const { where, skip, take, orderBy } = params;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async findOne(id: string, userId?: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
        ...(userId && { userId }),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: number, userId?: string) {
    return this.prisma.order.findFirst({
      where: {
        orderNumber,
        ...(userId && { userId }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async cancel(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async getUserOrderStats(userId: string) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });
  }
}
