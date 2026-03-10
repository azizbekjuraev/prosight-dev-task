import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { LocusEntity } from './entities/locus.entity';
import { LocusMemberEntity } from './entities/locus-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocusEntity, LocusMemberEntity])],
  controllers: [LocusController],
  providers: [LocusService],
})
export class LocusModule { }
