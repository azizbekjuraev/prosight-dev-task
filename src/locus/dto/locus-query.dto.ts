import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum LocusSideloading {
  locusMembers = 'locusMembers',
}

export enum LocusSortBy {
  id = 'id',
  assemblyId = 'assemblyId',
  locusStart = 'locusStart',
  memberCount = 'memberCount',
}

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export class GetLocusQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  regionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({ enum: LocusSideloading })
  @IsOptional()
  @IsEnum(LocusSideloading)
  sideloading?: LocusSideloading;

  @ApiPropertyOptional({ enum: LocusSortBy, default: LocusSortBy.id })
  @IsOptional()
  @IsEnum(LocusSortBy)
  sortBy: LocusSortBy = LocusSortBy.id;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.asc })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.asc;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 1000, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 1000;
}
