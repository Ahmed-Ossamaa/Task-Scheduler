import { Body, Controller, Get, Patch, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user:JwtPayload):Promise<User> {
    return this.userService.findUserById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser() user:JwtPayload,
    @Body() updateUserDto:UpdateUserDto
): Promise<User> {
    return this.userService.updateUserProfile(user.id, updateUserDto);

  }
}
