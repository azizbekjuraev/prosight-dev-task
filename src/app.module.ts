import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LocusModule } from './locus/locus.module';
import { LocusEntity } from './locus/entities/locus.entity';
import { LocusMemberEntity } from './locus/entities/locus-member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'hh-pgsql-public.ebi.ac.uk',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'reader',
      password: process.env.DB_PASSWORD || 'NWDMCE5xdipIjRrp',
      database: process.env.DB_NAME || 'pfmegrnargs',
      entities: [LocusEntity, LocusMemberEntity],
      synchronize: false,
      logging: false,
      ssl: false,
    }),
    AuthModule,
    LocusModule,
  ],
})
export class AppModule { }
