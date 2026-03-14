import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
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
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get my profile' })
  @Get('me')
  async getMyProfile(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.userService.findUserById(user.sub);
  }

  @ApiOperation({ summary: 'Update my profile' })
  @Patch('me')
  async updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserProfile(user.sub, updateUserDto);
  }

  @ApiOperation({ summary: 'Get all users with pagination (admin only)' })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Roles(UserRole.ADMIN)
  @Get('all')
  async getAllUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.userService.findAllUsers(page, limit);
  }

  @ApiOperation({ summary: 'Get all users in my organization (manager only)' })
  @Get('org-employees')
  @Roles(UserRole.MANAGER)
  async getAllUsersInOrg(@CurrentUser() manager: JwtPayload) {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.userService.findMyEmployees(manager.organizationId);
  }

  @ApiOperation({ summary: 'Delete user "soft delete" (admin only)' })
  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
