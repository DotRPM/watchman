import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsDefined()
  @IsNotEmpty()
  url: string;

  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  image: string;

  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsNotEmpty()
  currency: string;

  @IsDefined()
  @IsNumber()
  interval: number;

  @IsDefined()
  @IsNumber()
  threshold: number;
}
