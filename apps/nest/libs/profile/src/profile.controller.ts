import { Controller, Get, Body, Put, Param, UseGuards, Query } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { CurUser } from '@app/core/decorators/user.decorator'
import { UserEntity } from '@app/user/entities/user.entity'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ProfileEntity } from './entities/profile.entity'
import { JwtGuard } from '@app/auth/guards/jwt.guard'
import { ProfileUpdateDto } from './dtos/profile.update.dto'
import { ParseJsonPipe } from '@app/core/pipes/parse-json.pipe'
import { ParseBigIntPipe } from '@app/core/pipes/parse-bigint.pipe'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // @Get()
  // findAll(@Query('params', ParseJsonPipe) params) {
  //   return this.profileService.findAll(params)
  // }

  @ApiOkResponse({ type: ProfileEntity })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  me(@CurUser() user: UserEntity) {
    return this.profileService.findOne(user.profileId)
  }

  // @Get(':id')
  // findOne(@Param('id', ParseBigIntPipe) id: bigint) {
  //   return this.profileService.findOne(id)
  // }

  @ApiOkResponse({ type: ProfileEntity })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('me')
  update(@CurUser() user: UserEntity, @Body() profileUpdateDto: ProfileUpdateDto) {
    return this.profileService.update(user.profileId, profileUpdateDto)
  }

  // @Patch(':id')
  // update(@Param('id', ParseBigIntPipe) id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto)
  // }
}
