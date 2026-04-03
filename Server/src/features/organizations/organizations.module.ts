import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { UserModule } from 'src/features/users/users.module';
import { StorageModule } from 'src/integrations/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    UserModule,
    StorageModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
