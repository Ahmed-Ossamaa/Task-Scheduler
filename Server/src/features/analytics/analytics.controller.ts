import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary: 'get Platform analytics (Total users, orgs, projects, tasks)',
  })
  @Get('platform')
  @Roles(UserRole.ADMIN)
  getAnalytics() {
    return this.analyticsService.getPlatformAnalytics();
  }
}
