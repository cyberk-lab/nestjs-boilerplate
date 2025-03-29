import { ApiProperty } from '@nestjs/swagger'
import { Role, User, UserProvider } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'

export class UserEntity implements User {
  /**
   * @deprecated You should use [`profileId`] in almost cases, othewise plz ignore
   */
  @Expose()
  @ApiProperty({ type: BigInt })
  id: bigint

  @Expose()
  @ApiProperty({ enum: Role })
  role: Role
  @Expose()
  @ApiProperty({ type: String })
  name: string
  @Exclude()
  jwtValidFrom: Date
  @Expose()
  @ApiProperty({ type: Boolean })
  blocked: boolean
  @Expose()
  @ApiProperty({ type: Boolean })
  confirmed: boolean
  @Expose()
  @ApiProperty({ type: String })
  username: string

  @Exclude()
  password: string
  @Exclude()
  confirmationHash: string
  @Expose()
  @ApiProperty({ enum: UserProvider })
  provider: UserProvider
  @Expose()
  @ApiProperty({ type: BigInt })
  profileId: bigint
  @Exclude()
  lastLoginAt: Date
  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date
  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date

  @Exclude()
  verifyCode: string
  @Exclude()
  verifyCodeCount: number
  @Exclude()
  verifyCreatedAt: Date
}
