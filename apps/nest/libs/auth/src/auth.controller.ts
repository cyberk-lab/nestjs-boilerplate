import { CurUser } from '@app/core/decorators/user.decorator'
import { UserEntity } from '@app/user/entities/user.entity'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { TokenRefreshResDto, TokenResDto } from './dtos/token.res.dto'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { JwtGuard } from './guards/jwt.guard'
import { LocalGuard } from './guards/local.guard'
import { SocialProviderType as SocialProviderType } from './services/providers-register.service'
import { JwtRefreshGuard } from './guards/jwt.refresh.guard'
import { ExcludeProfile } from '@app/core/decorators/exclude-profile.decorator'
import { ConfirmDto } from './dtos/confirm.dto'
import { ExcludeConfirm } from '@app/core/decorators/exclude-confirm.decorator'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { ConfirmResetPasswordDto } from './dtos/confirm.reset-password.dto'
import { Request } from 'express'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @ApiCreatedResponse({ type: () => TokenResDto })
  @Post('local')
  @HttpCode(HttpStatus.OK)
  // DO NOT DELETE userLoginDto due to swagger
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@CurUser() user: UserEntity, @Body() _userLoginDto: LoginDto) {
    return this.authService.issueToken(user)
  }

  @ApiOkResponse({ type: TokenResDto })
  @Get('local/confirm')
  confirmMail(@Req() req: Request, @Query() dto: ConfirmDto) {
    return this.authService.confirm(req, dto)
  }

  @ApiOkResponse({ type: Boolean })
  @Post('local/resend-confirm')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ExcludeConfirm()
  @ExcludeProfile()
  @HttpCode(HttpStatus.OK)
  resendConfirmMail(@CurUser() user: UserEntity) {
    return this.authService.resendConfirmMail(user)
  }

  @ApiOkResponse({ type: Boolean })
  @Post('local/reset-password')
  @ExcludeConfirm()
  @ExcludeProfile()
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @ApiOkResponse({ type: TokenResDto })
  @Post('local/confirm-reset-password')
  @HttpCode(HttpStatus.OK)
  confirmResetPassword(@Body() dto: ConfirmResetPasswordDto) {
    return this.authService.confirmResetPassword(dto)
  }

  @ApiOkResponse({ type: TokenResDto })
  @ApiBearerAuth()
  @Post('init-profile')
  @ExcludeProfile()
  @UseGuards(JwtGuard)
  initProfile(@CurUser() user: UserEntity) {
    return this.authService.initProfile(user)
  }

  @ApiBearerAuth('refresh')
  @ApiOkResponse({ type: TokenRefreshResDto })
  @UseGuards(JwtRefreshGuard)
  @Get('refreshToken')
  refreshTokens(@CurUser() user: UserEntity) {
    return this.authService.refreshToken(user)
  }

  @ApiCreatedResponse({ type: TokenResDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('local/register')
  register(@Req() req: Request, @Body() createUserDto: RegisterDto) {
    return this.authService.register(req, createUserDto)
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtGuard)
  @Get('me')
  @ExcludeProfile()
  @ExcludeConfirm()
  me(@Req() req) {
    return req.user
  }

  @ApiParam({ name: 'provider', enum: ['facebook', 'apple', 'google'] })
  @ApiQuery({ name: 'access_token', type: String })
  @ApiOkResponse({ type: TokenResDto })
  @Get(':provider/callback')
  socialCallback(@Param('provider') provider: SocialProviderType, @Query('access_token') accessToken: string) {
    return this.authService.callback(provider, accessToken)
  }

  // @Post('email/confirm')
  // @HttpCode(HttpStatus.OK)
  // async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
  //   return this.service.confirmEmail(confirmEmailDto.hash);
  // }

  // @Post('forgot/password')
  // @HttpCode(HttpStatus.OK)
  // async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
  //   return this.service.forgotPassword(forgotPasswordDto.email);
  // }

  // @Post('reset/password')
  // @HttpCode(HttpStatus.OK)
  // async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
  //   return this.service.resetPassword(
  //     resetPasswordDto.hash,
  //     resetPasswordDto.password,
  //   );
  // }
}
