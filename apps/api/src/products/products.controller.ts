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
import { AuthGuard } from 'src/auth/auth.guard';
import { UserGuard } from 'src/auth/user.guard';
import { GetAuth } from 'src/auth/auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @GetAuth() { userId }: Auth,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get('details')
  getDetails(@Query('url') url: string) {
    return this.productsService.details(new URL(url));
  }

  @Get()
  @UseGuards(UserGuard)
  listRecentPosts(
    @GetAuth() { userId }: Auth,
    @Query('page') page: number = 0,
    @Query('search') search: string = '',
  ) {
    return this.productsService.list(userId, page, search);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  findOne(@GetAuth() { userId }: Auth, @Param('id') id: string) {
    return this.productsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
