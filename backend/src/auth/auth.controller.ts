import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  healthCheck() {
    return { status: 'OK', service: 'auth' };
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }, @Res() res: any) {
    try {
      const result = await this.authService.signUp(body.email, body.password);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message
      });
    }
  }

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }, @Res() res: any) {
    try {
      const result = await this.authService.signIn(body.email, body.password);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message
      });
    }
  }
}