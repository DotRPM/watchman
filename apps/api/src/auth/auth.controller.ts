import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { VerifyDto } from './dto/verify.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private DOMAIN: string;

  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    this.DOMAIN = this.configService.get('HOST').split('/')[2].split(':')[0];
  }

  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('signout')
  async signout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', null);
    return { success: true };
  }

  @Post('verify')
  async verify(
    @Body() verifyDto: VerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.verify(verifyDto);
    res.cookie('token', token, {
      domain: this.DOMAIN,
      httpOnly: true,
    });
    return { token };
  }
}
