import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrowserService } from 'src/browser/browser.service';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private browser: BrowserService,
  ) {}
  websites = {
    'amazon.in': {
      currency:
        '#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2) > span.a-price-symbol',
      price:
        '#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole',
      title: '#productTitle',
      image: '#landingImage',
    },
    'flipkart.com': {
      currency:
        '#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-8-12 > div:nth-child(2) > div > div.x\\+7QT1 > div.UOCQB1 > div > div.Nx9bqj.CxhGGd',
      price:
        '#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-8-12 > div:nth-child(2) > div > div.x\\+7QT1 > div.UOCQB1 > div > div.Nx9bqj.CxhGGd',
      title:
        '#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-8-12 > div:nth-child(2) > div > div:nth-child(1) > h1 > span',
      image:
        '#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-5-12.MfqIAz > div:nth-child(1) > div > div.qOPjUY > div._8id3KM > div.vU5WPQ > div._4WELSP._6lpKCl > img',
    },
  } as const;

  create(createProductDto: CreateProductDto, userId: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  list(userId: string, page: number, search: string) {
    const limit = 10;

    return this.prisma.product.findMany({
      where: { userId, title: { contains: search, mode: 'insensitive' } },
      skip: page * limit,
      take: limit,
    });
  }

  async details(url: URL) {
    const domain = url.host.replace('www.', '');

    const config = this.websites[domain as keyof typeof this.websites];
    if (!config) throw new ForbiddenException('Website not listed', domain);
    const sanitizedUrl = new URL(url).origin + new URL(url).pathname;
    const result = await this.browser.getDataFromConfig(sanitizedUrl, config);

    return result;
  }

  async price(url: URL) {
    const domain = url.host.replace('www.', '');

    const config = this.websites[domain as keyof typeof this.websites];
    const sanitizedUrl = new URL(url).origin + new URL(url).pathname;
    const price = await this.browser.getPriceFromPath(
      sanitizedUrl,
      config.price,
    );

    return price;
  }

  async remove(productId: string) {
    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return { success: true };
  }

  findOne(id: string, userId: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto },
    });
  }
}
