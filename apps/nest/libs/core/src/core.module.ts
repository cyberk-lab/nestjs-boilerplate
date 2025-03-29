import { ph } from '@app/helper/prisma.helper'
import { createKeyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [createKeyv(process.env.REDIS_URL)],
          ttl: 30 * 1000, // default TTL 30 seconds
        }
      },
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          // log: ['query'],
        },
        middlewares: [
          ph.defaultPagingMiddleware(),
          // loggingMiddleware(),
        ],
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
