import { Product } from 'database';
import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private mailService: MailerService,
  ) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    this.logger.debug('Worker starts');

    // get products according to the interval
    const products = (await this.prisma.$queryRaw`
        SELECT * FROM "Product" WHERE FLOOR((EXTRACT(EPOCH FROM (NOW() - "createdAt")) / 3600) % "interval") = 0;
    `) as Product[];

    for (const product of products) {
      const price = await this.productsService.price(new URL(product.url));
      this.logger.debug(product.title, price);

      // update the price in database
      product.updates.unshift(price);
      await this.productsService.update(product.id, {
        updates: product.updates,
      });

      // check if the thresholds met
      if (price < product.price && price <= product.threshold) {
        await this.sendDropNotification(product, price);
      } else if (price > product.price && price >= product.threshold) {
        await this.sendRiseNotification(product, price);
      }
    }
  }

  async sendDropNotification(product: Product, price: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: product.userId },
    });
    const percent = ((product.price - price) / product.price) * 100;

    // send verification link through mail
    await this.mailService.sendMail({
      to: user.email,
      subject: `Your product price dropped ${percent}%`,
      text: `Product: ${product.title}. Original price: ${product.currency}${product.price}. New price: ${product.currency}${price}`,
    });
  }

  async sendRiseNotification(product: Product, price: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: product.userId },
    });
    const percent = ((price - product.price) / product.price) * 100;

    // send verification link through mail
    await this.mailService.sendMail({
      to: user.email,
      subject: `Your product price rises ${percent}%`,
      text: `Product: ${product.title}. Original price: ${product.currency}${product.price}. New price: ${product.currency}${price}`,
    });
  }
}
