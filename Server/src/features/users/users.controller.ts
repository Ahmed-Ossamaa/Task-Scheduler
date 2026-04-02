import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { StorageService } from '../../integrations/storage/storage.interface';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/features/auth/interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './enums/user-roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { ApiImageUpload } from 'src/common/decorators/api-image-upload.decorator';
import { ImageValidationPipe } from 'src/common/pipes/image-validation.pipe';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

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

  @ApiOperation({ summary: 'Upload or update my avatar' })
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @ApiImageUpload('avatar')
  @Patch('avatar')
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(ImageValidationPipe)
    file: Express.Multer.File,
  ): Promise<User> {
    const avatarUrl = await this.storageService.uploadImage(
      file,
      'user_avatars', //folderName
      user.sub, //fileName = user_id
      true, //overwrite existing
    );

    //Save URL to the user.avatar
    return this.userService.updateAvatar(user.sub, avatarUrl);
  }

  @ApiOperation({
    summary: 'Remove My avatar and delete it from cloud storage',
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete('avatar')
  async removeAvatar(@CurrentUser() user: JwtPayload) {
    try {
      await this.storageService.deleteImage(`user_avatars/${user.sub}`);
    } catch (error) {
      console.warn('Error while deleting avatar from cloud', error);
    }
    return this.userService.removeAvatar(user.sub);
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

  @ApiOperation({ summary: 'Get all users in my organization' })
  @Get('org-employees')
  async getAllUsersInOrg(@CurrentUser() user: JwtPayload) {
    if (!user.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    const users = await this.userService.findMyEmployees(user.organizationId);
    return users;
  }

  @ApiOperation({ summary: 'Change employee role (Manager only)' })
  @Patch('employee/:userId/role')
  @Roles(UserRole.MANAGER)
  async updateEmployeeRole(
    @CurrentUser() manager: JwtPayload,
    @Param('userId', ParseUUIDPipe) empId: string,
    @Body('role') newRole: UserRole.MANAGER | UserRole.EMP,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }

    //Prevent managers from demoting themselves
    if (manager.sub === empId) {
      throw new ForbiddenException('You cannot change your own role.');
    }

    return await this.userService.updateEmployeeRole(
      manager.organizationId,
      empId,
      newRole,
    );
  }

  @ApiOperation({ summary: 'Remove employee from my org (Manager only)' })
  @Delete('employee/:userId')
  @Roles(UserRole.MANAGER)
  async removeEmployee(
    @CurrentUser() manager: JwtPayload,
    @Param('userId', ParseUUIDPipe) empId: string,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.userService.deleteEmployee(manager.organizationId, empId);
  }

  @ApiOperation({ summary: 'Delete user "soft delete" (admin only)' })
  @Patch(':userId')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
