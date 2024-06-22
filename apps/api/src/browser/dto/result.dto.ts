import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class ResultDto {
  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  currency: string;

  @IsDefined()
  @IsNotEmpty()
  image: string;
}
