import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(
    @CurrentUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  findAll(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: Role,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.findAll(userId, role, query);
  }

  @Get('stats')
  @Roles(Role.CUSTOMER)
  getUserStats(@CurrentUser('userId') userId: string) {
    return this.ordersService.getUserStats(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SELLER)
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
      userId,
      role,
    );
  }

  @Delete(':id/cancel')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  cancel(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.cancel(id, userId, role);
  }
}
