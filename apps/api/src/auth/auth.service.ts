import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyDto } from './dto/verify.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private JWT_SECRET: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
  }

  async signin({ email }: SignInDto) {
    // step 1 // check if the user exists
    let user = await this.usersService.findOneWithEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
      });
    }

    // step 2 // send otp to the user email
    await this.sendVerification(user.id);

    return user;
  }

  async sendVerification(userId: string) {
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // create verification
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verification: {
          create: { otp },
        },
      },
      select: {
        email: true,
        verification: {
          select: {
            id: true,
          },
        },
      },
    });

    // send verification link through mail
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email verification for Chali',
      text: `Please use the following OTP to verify your new accout for Chali. OTP: ${otp}`,
    });
  }

  async verify({ userId, otp }: VerifyDto) {
    // step 1 / get the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, verification: true },
    });

    // step 2 / verify otp
    if (user.verification.otp == otp) {
      // step 3 / delete verification
      await this.prisma.verification.delete({
        where: { id: user.verification.id },
      });

      // step 4 / set token
      const token = await this.generateJwtToken(user.id);
      return token;
    } else {
      throw new UnauthorizedException('Verfication failed');
    }
  }

  async generateJwtToken(userId: string) {
    const token = await this.jwtService.signAsync(
      { userId },
      { secret: this.JWT_SECRET },
    );
    return token;
  }
}
