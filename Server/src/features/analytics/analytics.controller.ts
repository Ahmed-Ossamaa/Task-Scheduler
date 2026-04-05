import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsDto } from './dto/analytics.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary: 'get Platform analytics (Total users, orgs, projects, tasks)',
  })
  @Get('platform')
  getAnalytics() {
    return this.analyticsService.getPlatformAnalytics();
  }

  @ApiOperation({
    summary:
      'get User Growth by interval (One month, three months, six months or one year)',
  })
  @Get('growth/user')
  getUserGrowth(@Query() dto: AnalyticsDto) {
    return this.analyticsService.getUserGrowth(dto.interval);
  }

  @ApiOperation({
    summary:
      'get Organization Growth by interval (One month, three months, six months or one year)',
  })
  @Get('growth/org')
  getOrgGrowth(@Query() dto: AnalyticsDto) {
    return this.analyticsService.getOrgGrowth(dto.interval);
  }
}
