import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {AddCartItemDto} from "./dto/add-cart-item.dto";

@ApiTags('cart')
@UseGuards(AuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  fetch(@CurrentUser('userId') userId: string) {
    return this.cartsService.fetch(userId);
  }

  @Post('items')
  addItem(
    @CurrentUser('userId') userId: string,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartsService.addItem(userId, dto.productId, dto.qty);
  }

  @Patch('items/:productId')
  updateItem(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItemQuantity(
      userId,
      productId,
      dto.qty,
    );
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartsService.remove(userId, productId);
  }

  @Delete()
  clearCart(@CurrentUser('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}
