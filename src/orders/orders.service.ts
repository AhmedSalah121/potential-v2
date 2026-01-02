import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/enums/role.enum';
import { OrderStatus } from './enums/order-status.enum';
import { OrderStatus as OrderStatusDatabase } from '@prisma/client/';

@Injectable()
export class OrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    private prisma: PrismaService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Validate products exist and get prices
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Check stock availability
    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      // product stock could be zero, handle this case in a better way instead of throwing that error cuz it's not an error
      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }
    }

    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItems = createOrderDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      // product stock could be zero, handle this case in a better way instead of throwing that error cuz it's not an error
      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }
      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
      };
    });

    // database sequence generates the order number

    // Create order and update stock in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await this.ordersRepository.create({
        userId,
        shippingAddress: createOrderDto.shippingAddress,
        totalAmount,
        items: orderItems,
      });

      // Update product stock
      for (const item of createOrderDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string, userRole: Role, query: OrderQueryDto) {
    const { status } = query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    // Customers can only see their own orders
    const where: any = {};
    if (userRole === Role.CUSTOMER) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }

    const { orders, total } = await this.ordersRepository.findAll({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const order = await this.ordersRepository.findOne(
      id,
      userRole === Role.CUSTOMER ? userId : undefined,
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    userId: string,
    userRole: Role,
  ) {
    const order = await this.ordersRepository.findOne(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Sellers can only update orders they created (through products)
    if (userRole === Role.SELLER) {
      const sellerProducts = await this.prisma.product.findMany({
        where: { userId },
        select: { id: true },
      });

      const sellerProductIds = sellerProducts.map((p) => p.id);
      const orderProductIds = order.items.map((item) => item.productId);

      const hasSellerProduct = orderProductIds.some((id) =>
        sellerProductIds.includes(id),
      );

      if (!hasSellerProduct) {
        throw new ForbiddenException(
          'You can only update orders containing your products',
        );
      }
    }

    // Validate status transitions
    this.validateStatusTransition(order.status, updateOrderStatusDto.status);

    return this.ordersRepository.updateStatus(id, updateOrderStatusDto.status);
  }

  async cancel(id: string, userId: string, userRole: Role) {
    const order = await this.ordersRepository.findOne(
      id,
      userRole === Role.CUSTOMER ? userId : undefined,
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only pending orders can be cancelled
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore stock

    await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await this.ordersRepository.updateStatus(id, OrderStatus.CANCELLED);
    });

    return { message: 'Order cancelled successfully' };
  }

  async getUserStats(userId: string) {
    return this.ordersRepository.getUserOrderStats(userId);
  }

  private validateStatusTransition(
    currentStatus: OrderStatusDatabase,
    newStatus: OrderStatus,
  ) {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
