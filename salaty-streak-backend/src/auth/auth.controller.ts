import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@Request() req: { user: { sub: string } }) {
    return this.authService.getProfile(req.user.sub);
  }

  @Put('profile')
  updateProfile(
    @Request() req: { user: { sub: string } },
    @Body() body: { name?: string; timezone?: string; latitude?: number; longitude?: number },
  ) {
    return this.authService.updateProfile(req.user.sub, body);
  }
}