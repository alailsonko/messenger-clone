import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from 'src/application/auth/auth.service';
import { JwtAuthGuard } from 'src/application/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/application/auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
