import {
  Controller,
  Request,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/application/auth/guards/jwt-auth.guard';
import { AvatarsService } from 'src/application/avatars/avatars.service';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.type';

@ApiTags('avatars')
@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The avatar and user data',
    type: 'multipart/form-data',
  })
  @Put(':userId')
  @ApiCreatedResponse({
    description: 'Avatar updated successfully',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    await this.avatarsService.updateAvatar({ avatar, userId });
    return { message: 'Avatar updated successfully' };
  }
}
