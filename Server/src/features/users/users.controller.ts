import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
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
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './enums/user-roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { ApiImageUpload } from 'src/common/decorators/api-image-upload.decorator';
import { ImageValidationPipe } from 'src/common/pipes/image-validation.pipe';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsers } from './types/paginated-users-interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  // -------- Static Routes --------

  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('me')
  async getMyProfile(
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponseDto> {
    return await this.userService.getUserPorfile(user.sub);
  }

  @ApiOperation({ summary: 'Update my profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @Patch('me')
  async updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserProfile(user.sub, updateUserDto);
  }

  //-------User's Media Routes -------

  @ApiOperation({ summary: 'Upload or update my avatar' })
  @ApiOkResponse({ type: UserResponseDto })
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @ApiImageUpload('avatar')
  @Patch('avatar')
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(ImageValidationPipe)
    file: Express.Multer.File,
  ): Promise<UserResponseDto> {
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
  @ApiOkResponse({ type: UserResponseDto })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete('avatar')
  async removeAvatar(
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponseDto> {
    try {
      await this.storageService.deleteImage(`user_avatars/${user.sub}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn(
          'Failed to delete avatar from cloud storage',
          error.stack,
        );
      } else {
        this.logger.warn('Failed to delete avatar from cloud storage');
      }
    }
    return this.userService.removeAvatar(user.sub);
  }

  //--------Organization Routes --------

  @ApiOperation({
    summary: 'Get all users in my organization (Anyone inside the Org)',
  })
  @Get('org-employees')
  async getAllUsersInOrg(
    @CurrentUser() user: JwtPayload,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ): Promise<PaginatedUsers> {
    if (!user.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    const users = await this.userService.findMyTeam(
      user.organizationId,
      page,
      limit,
    );
    return users;
  }

  @ApiOperation({ summary: 'Get all Deleted employees (Manager only)' })
  @Get('employee/archived')
  @Roles(UserRole.MANAGER)
  async getArchivedEmployees(
    @CurrentUser() manager: User,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ): Promise<PaginatedUsers> {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.userService.getDeletedEmployees(
      manager.organizationId,
      page,
      limit,
    );
  }

  @ApiOperation({ summary: 'Get user public profile by ID (Same Org)' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get(':userId/profile')
  async getUserById(
    @Param('userId') targetUserId: string,
    @CurrentUser() requester: JwtPayload,
  ): Promise<UserResponseDto> {
    return await this.userService.getUserPorfile(targetUserId, requester);
  }

  @ApiOperation({ summary: 'Change employee role (Manager only)' })
  @ApiOkResponse({ type: UserResponseDto })
  @Patch('employee/:userId/role')
  @Roles(UserRole.MANAGER)
  async updateEmployeeRole(
    @CurrentUser() manager: JwtPayload,
    @Param('userId', ParseUUIDPipe) empId: string,
    @Body('role') newRole: UserRole.MANAGER | UserRole.EMP,
  ): Promise<UserResponseDto> {
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

  @ApiOperation({ summary: 'restore deleted Employee (Manager only)' })
  @Patch('employee/:userId/restore')
  @Roles(UserRole.MANAGER)
  async restoreEmployee(
    @CurrentUser() manager: JwtPayload,
    @Param('userId', ParseUUIDPipe) empId: string,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.userService.restoreEmployee(empId, manager.organizationId);
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

  //--------Admin Routes --------

  @Get('archived')
  @Roles(UserRole.ADMIN)
  async getDeletedUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ): Promise<PaginatedUsers> {
    return this.userService.getDeletedUsers(page, limit);
  }

  @ApiOperation({ summary: 'Get all users with pagination (admin only)' })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ): Promise<PaginatedUsers> {
    return this.userService.findAllUsers(page, limit);
  }

  @ApiOperation({ summary: 'Restore deleted user (admin only)' })
  @Patch(':userId/restore')
  @Roles(UserRole.ADMIN)
  async restoreUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.restoreUser(userId);
  }

  @ApiOperation({ summary: 'Delete user "soft delete" (admin only)' })
  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
