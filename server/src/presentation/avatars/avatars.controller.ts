import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Param,
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The avatar and user data',
    type: 'multipart/form-data',
  })
  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Avatar created successfully',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async createAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    await this.avatarsService.createAvatar({ avatar, userId });
    return { message: 'Avatar created successfully' };
  }
}
