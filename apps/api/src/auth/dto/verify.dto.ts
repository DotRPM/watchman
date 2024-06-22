import { IsNotEmpty, IsDefined, IsNumber } from 'class-validator';

export class VerifyDto {
  @IsDefined()
  @IsNotEmpty()
  userId: string;

  @IsDefined()
  @IsNumber()
  otp: number;
}
