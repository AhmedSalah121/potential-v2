import { OrderStatus } from '../enums/order-status.enum';

export class OrderItemResponseDto {
  id: string;
  quantity: number;
  price: string;
  productId: string;
  productName?: string;
  createdAt: Date;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: string;
  shippingAddress: string;
  userId: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedOrderResponseDto {
  data: OrderResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
