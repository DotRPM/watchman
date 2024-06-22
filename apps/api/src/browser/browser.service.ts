import { ConfigDto } from './dto/config.dto';
import { ResultDto } from './dto/result.dto';
import puppeteer, { Browser } from 'puppeteer';
import {
  ConflictException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class BrowserService implements OnModuleInit, OnModuleDestroy {
  browser: Browser;

  async onModuleInit() {
    console.log('Opening browser...');
    this.browser = await puppeteer.launch();
  }

  async getDataFromConfig(url: string, config: ConfigDto) {
    console.log('Opening page...');
    const page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: 'load',
      timeout: 0,
    });

    // loop through each item and get value
    let data: ResultDto = { title: '', currency: '', price: 0, image: '' };
    try {
      // title
      data.title = await page.$eval(config.title, (element) => {
        return element.innerHTML.trim();
      });

      // currency
      const currency = await page.$eval(config.currency, (element) => {
        return element.innerHTML.trim();
      });
      data.currency = this.getCurrencySymbol(currency);

      // price
      const price = await page.$eval(config.price, (element) => {
        return element.innerHTML.trim();
      });
      data.price = this.getPrice(price);

      // image
      data.image = await page.$eval(config.image, (element) => {
        return element.attributes.getNamedItem('src').value;
      });
    } catch (err) {
      throw new ConflictException('Website elements not working', url);
    }

    console.log('Closing page...');
    await page.close();
    return data;
  }

  async getDataFromPath(url: string, path: string) {
    console.log('Opening page...');
    const page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: 'load',
      timeout: 0,
    });

    // loop through each item and get value
    const data = await page.$eval(path, (element) => {
      return element.innerHTML.trim();
    });

    console.log('Closing page...');
    await page.close();
    return data;
  }

  async getPriceFromPath(url: string, path: string) {
    const value = await this.getDataFromPath(url, path);
    return this.getPrice(value);
  }

  getPrice(str: string) {
    return Number(str.replace(/[^0-9\.-]+/g, ''));
  }

  getCurrencySymbol(str: string) {
    //replace all numbers, spaces, commas, and periods with an empty string
    //we should only be left with the currency symbols
    return str.replace(/[\d\., ]/g, '');
  }

  async onModuleDestroy() {
    if (this.browser) {
      console.log('Closing browser');
      await this.browser.close();
    }
  }
}
