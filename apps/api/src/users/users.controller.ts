import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAuth } from 'src/auth/auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findCurrent(@GetAuth() { userId }: Auth) {
    return this.usersService.findOne(userId);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@GetAuth() { userId }: Auth, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@GetAuth() { userId }: Auth) {
    return this.usersService.remove(userId);
  }
}
