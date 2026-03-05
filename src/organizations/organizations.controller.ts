import { Controller, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('orgnizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create an organization' })
  @Post('/create')
  @Roles(UserRole.MANAGER)
  async createOrganization(@CurrentUser() manager: JwtPayload) {}

  
}
