import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/enums/user-roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { StorageService } from '../../integrations/storage/storage.interface';
import { ApiImageUpload } from '../../common/decorators/api-image-upload.decorator';
import { ImageValidationPipe } from '../../common/pipes/image-validation.pipe';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({ summary: 'Upload general app media (Admin only)' })
  @Roles(UserRole.ADMIN)
  @ApiImageUpload('file')
  @Post('upload')
  async uploadMedia(
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
  ) {
    const mediaUrl = await this.storageService.uploadImage(file, 'app_assets');

    return {
      message: 'Media uploaded successfully',
      url: mediaUrl,
    };
  }

  @ApiOperation({ summary: 'Delete general app media (Admin only)' })
  @Roles(UserRole.ADMIN)
  @Delete('/delete')
  async deleteMedia(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('Image URL is required');
    }

    const publicId = this.storageService.extractPublicIdFromUrl(url);

    if (!publicId) {
      throw new BadRequestException('Invalid Cloudinary URL format');
    }

    await this.storageService.deleteImage(publicId);

    return { message: 'Media deleted successfully' };
  }
}
