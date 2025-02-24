import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @Expose()
  @ApiProperty({ example: 'user1@gmail.com', required: true, type: () => String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly username: string

  @Expose()
  @ApiProperty({ minLength: 6, example: '123qwe', required: true, type: () => String })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string

  // @IsString()
  // @IsOptional()
  // readonly confirmationHash: string

  // @IsString()
  // @IsOptional()
  // readonly provider: UserProvider
}
