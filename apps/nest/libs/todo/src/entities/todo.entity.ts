import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ProfileEntity } from '@app/profile/entities/profile.entity'

export class TodoEntity {
  @ApiProperty()
  @Expose()
  id: bigint

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  description?: string

  @ApiProperty()
  @Expose()
  done: boolean

  @ApiProperty()
  @Expose()
  profileId: bigint

  @ApiProperty({ type: () => ProfileEntity })
  @Type(() => ProfileEntity)
  @Expose()
  profile: ProfileEntity
}
