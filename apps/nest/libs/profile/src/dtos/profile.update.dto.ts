import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator'

export class ProfileUpdateDto {
  @ApiPropertyOptional({ example: 'Harry' })
  @Expose()
  @IsOptional()
  @IsString()
  name: string

  @ApiPropertyOptional({ example: '2025-01-01', type: Date })
  @Expose()
  @IsOptional()
  @IsDateString()
  dob: Date
}
