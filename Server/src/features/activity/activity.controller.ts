import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DEMO_USER } from 'src/common/constants/demo-accounts.constant';

@Controller('activity')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({
    summary: 'Get activity logs (Org or User creation / deletion)',
  })
  @Get('logs')
  async getActivityLogs(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.activityService.getGlobalActivity(page, limit);
  }

  @ApiOperation({ summary: 'Get system errors (paginated logs)' })
  @Get('system-health')
  async getSystemErrors(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ) {
    return this.activityService.getSystemErrors(page, limit);
  }

  @ApiOperation({ summary: 'Delete all activity logs (truncate)' })
  @Delete('activity-logs')
  async deleteActivityLogs(@CurrentUser() admin: JwtPayload) {
    if (admin.sub === DEMO_USER) {
      throw new ForbiddenException(
        'Demo Admin Account: permenant deletion is not allowed.',
      );
    }
    return this.activityService.DeleteAllActivityLogs();
  }

  @ApiOperation({ summary: 'Delete all system error logs (truncate)' })
  @Delete('error-logs')
  async deleteErrorLogs(@CurrentUser() admin: JwtPayload) {
    if (admin.sub === DEMO_USER) {
      throw new ForbiddenException(
        'Demo Admin Account: permenant deletion is not allowed.',
      );
    }
    return this.activityService.DeleteAllErrorLogs();
  }

  // @Get('test-crash')
  // @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMP)
  // simulateSystemCrash() {
  //   throw new Error(
  //     'This is a deliberate test crash to verify the logging system.',
  //   );
  // }
}
