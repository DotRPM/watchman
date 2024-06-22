import { IsDefined, IsNotEmpty } from 'class-validator';

export class ConfigDto {
  @IsDefined()
  @IsNotEmpty()
  price: string;

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
