import { Module } from '@nestjs/common';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';

@Module({
  controllers: [LocusController],
  providers: [LocusService],
})
export class LocusModule { }
