import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './enums/user-roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  async getMyProfile(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.userService.findUserById(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  async updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserProfile(user.sub, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOperation({ summary: 'Get all users with pagination (admin only)' })
  async getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.userService.findAllUsers(page, limit);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user "soft delete" (admin only)' })
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
