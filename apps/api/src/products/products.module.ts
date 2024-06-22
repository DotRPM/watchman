import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './products.controller';
import { BrowserModule } from 'src/browser/browser.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [JwtModule, ConfigModule, PrismaModule, BrowserModule],
  exports: [ProductsService],
})
export class ProductsModule {}
