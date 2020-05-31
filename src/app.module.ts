import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';

/**
 * Set APP_ENV environment variable to load
 * a different .env file.
 */
const env = process.env.APP_ENV || 'dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.${env}.env`,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://developer:VBg5vSmFitW4QC8O@cluster0-puo7u.mongodb.net/fashion-cloud-challange?retryWrites=true&w=majority',
    ),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
