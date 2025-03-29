import { JwtGuard } from '@app/auth/guards/jwt.guard'
import { ExcludeProfile } from '@app/core/decorators/exclude-profile.decorator'
import { Roles } from '@app/core/decorators/role.decorator'
import { ParseBigIntPipe } from '@app/core/pipes/parse-bigint.pipe'
import { Controller, Get, UseGuards, Patch, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserEntity } from './entities/user.entity'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @Patch('promote-admin/:id')
  @UseGuards(JwtGuard)
  @Roles('SUPERADMIN')
  @ExcludeProfile()
  promoteAdmin(@Param('id', ParseBigIntPipe) id) {
    return this._userService.changeRole(id, 'ADMIN')
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @Patch('demote-admin/:id')
  @UseGuards(JwtGuard)
  @Roles('SUPERADMIN')
  @ExcludeProfile()
  demoteAdmin(@Param('id', ParseBigIntPipe) id) {
    return this._userService.changeRole(id, 'USER')
  }

  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserEntity, isArray: true })
  // @Get()
  // @UseGuards(JwtGuard)
  // findAll(@Query() query) {
  //   return this._userService.findAll(query)
  // }
}
