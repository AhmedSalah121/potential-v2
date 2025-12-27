import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('cart')
@UseGuards(AuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  fetch(@Req() req: any) {
    return this.cartsService.fetch(req.user.userId);
  }

  @Patch('update')
  update(@Req() req: any, @Body() dto: UpdateCartDto) {
    return this.cartsService.save(req.user.userId, dto.productId, dto.qty);
  }

  @Delete('items/:productId')
  deleteItem(@Req() req: any, @Param('productId') productId: string) {
    return this.cartsService.save(req.user.userId, productId, 0);
  }
}
