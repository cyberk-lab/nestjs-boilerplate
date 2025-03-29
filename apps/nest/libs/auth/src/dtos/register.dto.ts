import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { normalizeEmail } from 'validator'

export class RegisterDto {
  @Expose()
  @ApiProperty({ example: 'user1@gmail.com', required: true, description: 'Currently only support email' })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  @IsNotEmpty()
  readonly username: string

  @Expose()
  @ApiProperty({ minLength: 6, example: '123qwe', required: true, type: () => String })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string
}
