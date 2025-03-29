import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { normalizeEmail } from 'validator'

export class LoginDto {
  @Expose()
  @ApiProperty({ example: 'user1@gmail.com', required: true })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  @IsNotEmpty()
  readonly username: string

  @Expose()
  @ApiProperty({ minLength: 6, example: '123qwe', required: true })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string
}
