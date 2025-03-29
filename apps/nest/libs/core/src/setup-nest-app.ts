import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { Reflector, HttpAdapterHost, NestFactory } from '@nestjs/core'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'
import { AllExceptionsFilter } from './filters/all-exception-filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Handler } from 'express'
import serverlessExpress from '@vendia/serverless-express'
import { preboot } from '@app/helper/pre-boot'
import { AppClassSerializerInterceptor } from './interceptors/app-class-serializer.interceptor'

preboot()

export async function setupNestApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, transformOptions: { strategy: 'excludeAll', exposeUnsetFields: false } }),
  )
  app.useGlobalInterceptors(
    new AppClassSerializerInterceptor(app.get(HttpAdapterHost), app.get(Reflector), {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
    }),
  )

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter), new AllExceptionsFilter(httpAdapter))

  app.enableShutdownHooks()
}

let app: INestApplication
let globalPrefix = ''
export async function setupSwaggerUI(app: INestApplication, options?: { route?: string; metadata?: any }) {
  const { route = 'docs', metadata } = options || {}
  const config = new DocumentBuilder()
    .setTitle('Nestjs Boilerplate')
    .setDescription('The Nestjs Boilerplate API description')
    .setVersion('0.1')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', `${globalPrefix}/docs-json`)
    .addBearerAuth({ type: 'http' }, 'refresh')
    .build()

  if (metadata) {
    await SwaggerModule.loadPluginMetadata(metadata)
  }
  const documentFactory = () => SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false })
  SwaggerModule.setup(route, app, documentFactory, { useGlobalPrefix: true })
}

export async function bootstrapServerless(modular, routePrefix = ''): Promise<Handler> {
  app = await NestFactory.create(modular, {
    logger: [
      'error',
      'warn',
      'debug',
      // 'verbose'
    ],
    cors: true,
  })
  setupNestApp(app)
  globalPrefix = routePrefix
  app.setGlobalPrefix(globalPrefix)
  setupSwaggerUI(app)
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp }) as any
}
