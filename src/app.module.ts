import { Module } from '@nestjs/common';
import { ConfigModule } from './server/config/config.module';
import { GPSModule } from './server/gps/gps.module';


@Module({
  imports: [
    ConfigModule,
    GPSModule,
  ],
})
export class AppModule {
}
