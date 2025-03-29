import { ProfileEntity } from '@app/profile/entities/profile.entity'
import { UserEntity } from '@app/user/entities/user.entity'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'

export class TokenResDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ example: 'jwt token' })
  readonly jwt: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ example: 'refresh token' })
  readonly jwtRefresh: string

  @IsNotEmptyObject()
  @Expose()
  @Type(() => UserEntity)
  @ApiProperty({ type: () => UserEntity })
  readonly user: UserEntity

  @Expose()
  @Type(() => ProfileEntity)
  @ApiProperty({ type: () => ProfileEntity, nullable: true })
  readonly profile: ProfileEntity | null
}

export class TokenRefreshResDto extends PickType(TokenResDto, ['jwt']) {}
