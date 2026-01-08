import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // Fetches the cart for a given userId. If the cart does not exist, it creates a new one.
  async fetch(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      ...cart,
      total,
    };
  }

  async addItem(userId: string, productId: string, qty: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not available');
    }

    if (product.stock < qty) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.fetch(userId);

    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
      update: {
        quantity: { increment: qty },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: qty,
      },
    });
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    newQuantity: number,
  ) {
    if (newQuantity === 0) {
      return this.remove(userId, productId);
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not available');
    }

    if (product.stock < newQuantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.fetch(userId);

    return this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  async remove(userId: string, productId: string) {
    const cart = await this.fetch(userId);

    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.fetch(userId);

    return this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  }
}
