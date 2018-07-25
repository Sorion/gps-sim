import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { GPSService } from './gps.service';
import { GPSGateway } from './gps.gateway';


@Module({
  imports: [ConfigModule],
  providers: [GPSService, GPSGateway]
})
export class GPSModule {
}
