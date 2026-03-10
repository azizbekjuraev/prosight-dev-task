import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiProperty
} from '@nestjs/swagger'

class LoginUserDto {
  @ApiProperty({ example: "admin", description: "User name" })
  username: string;

  @ApiProperty({ example: "Admin@Secure#2024", description: "User password" })
  password: string
}

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiBody({
    type: LoginUserDto
  })

  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
