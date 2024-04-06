import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Response,
} from '@nestjs/common';
import { AuthService } from 'src/application/auth/auth.service';
import { JwtAuthGuard } from 'src/application/auth/guards/jwt-auth.guard';
import { Response as ResponseType } from 'express';
import { LocalAuthGuard } from 'src/application/auth/guards/local-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: AuthenticatedRequest,
    @Response() res: ResponseType,
  ) {
    const response = await this.authService.login(req.user);

    res.cookie('refreshToken', response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 900000),
      maxAge: 900000,
    });
    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 900000),
      maxAge: 900000,
    });

    res.send({ message: 'Login successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
