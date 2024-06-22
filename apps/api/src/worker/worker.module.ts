import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [WorkerService],
  imports: [PrismaModule, ProductsModule],
})
export class WorkerModule {}
