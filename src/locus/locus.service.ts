import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetLocusQueryDto, LocusSideloading, LocusSortBy } from './dto/locus-query.dto';
import { LocusEntity } from './entities/locus.entity';
import { LocusMemberEntity } from './entities/locus-member.entity';
import { UserRole } from '../users/users.service';

const limitedRegionIds = [86118093, 86696489, 88186467];

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(LocusEntity)
    private readonly locusRepository: Repository<LocusEntity>,
    @InjectRepository(LocusMemberEntity)
    private readonly locusMemberRepository: Repository<LocusMemberEntity>,
  ) { }

  async getLocuses(query: GetLocusQueryDto, userRole: UserRole) {
    if (userRole === 'normal' && query.sideloading) {
      throw new ForbiddenException('Normal user cannot use sideloading');
    }

    const locusQueryBuilder = this.locusRepository.createQueryBuilder('locus');

    const shouldJoinLocusMembers =
      Boolean(query.regionId) ||
      Boolean(query.membershipStatus) ||
      query.sideloading === LocusSideloading.locusMembers ||
      userRole === 'limited';

    if (shouldJoinLocusMembers) {
      locusQueryBuilder.leftJoinAndSelect('locus.locusMembers', 'locusMember');
    }

    this.applyFilters(locusQueryBuilder, query, userRole);
    this.applySorting(locusQueryBuilder, query);
    this.applyPagination(locusQueryBuilder, query);
    this.applySelects(locusQueryBuilder, query, userRole);

    const locuses = await locusQueryBuilder.getMany();

    return locuses.map((locus) => this.mapLocusResponse(locus, query, userRole));
  }

  private applyFilters(
    locusQueryBuilder: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
    userRole: UserRole,
  ) {
    if (query.id) {
      locusQueryBuilder.andWhere('locus.id = :id', { id: query.id });
    }

    if (query.assemblyId) {
      locusQueryBuilder.andWhere('locus.assemblyId = :assemblyId', {
        assemblyId: query.assemblyId,
      });
    }

    if (query.regionId) {
      locusQueryBuilder.andWhere('locusMember.regionId = :regionId', {
        regionId: query.regionId,
      });
    }

    if (query.membershipStatus) {
      locusQueryBuilder.andWhere('locusMember.membershipStatus = :membershipStatus', {
        membershipStatus: query.membershipStatus,
      });
    }

    if (userRole === 'limited') {
      locusQueryBuilder.andWhere('locusMember.regionId IN (:...limitedRegionIds)', {
        limitedRegionIds: [86118093, 86696489, 88186467],
      });
    }
  }

  private applySorting(
    locusQueryBuilder: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
  ) {
    const sortFieldMap: Record<LocusSortBy, string> = {
      [LocusSortBy.id]: 'locus.id',
      [LocusSortBy.assemblyId]: 'locus.assemblyId',
      [LocusSortBy.locusStart]: 'locus.locusStart',
      [LocusSortBy.memberCount]: 'locus.memberCount',
    };

    locusQueryBuilder.orderBy(sortFieldMap[query.sortBy], query.sortOrder);
    locusQueryBuilder.addOrderBy('locus.id', 'ASC');
  }

  private applyPagination(
    locusQueryBuilder: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 1000;
    const skip = (page - 1) * limit;

    locusQueryBuilder.skip(skip);
    locusQueryBuilder.take(limit);
  }

  private applySelects(
    locusQueryBuilder: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
    userRole: UserRole,
  ) {
    locusQueryBuilder.select([
      'locus.id',
      'locus.assemblyId',
      'locus.locusName',
      'locus.publicLocusName',
      'locus.chromosome',
      'locus.strand',
      'locus.locusStart',
      'locus.locusStop',
      'locus.memberCount',
    ]);

    if (
      query.sideloading === LocusSideloading.locusMembers &&
      userRole !== 'normal'
    ) {
      locusQueryBuilder.addSelect([
        'locusMember.id',
        'locusMember.ursTaxid',
        'locusMember.regionId',
        'locusMember.locusId',
        'locusMember.membershipStatus',
      ]);
    }
  }

  private mapLocusResponse(
    locus: LocusEntity,
    query: GetLocusQueryDto,
    userRole: UserRole,
  ) {
    const baseResponse = {
      id: Number(locus.id),
      assemblyId: locus.assemblyId,
      locusName: locus.locusName,
      publicLocusName: locus.publicLocusName,
      chromosome: locus.chromosome,
      strand: locus.strand,
      locusStart: locus.locusStart,
      locusStop: locus.locusStop,
      memberCount: locus.memberCount,
    };

    if (
      query.sideloading === LocusSideloading.locusMembers &&
      userRole !== 'normal'
    ) {
      return {
        ...baseResponse,
        locusMembers: (locus.locusMembers ?? []).map((locusMember) => ({
          id: Number(locusMember.id),
          ursTaxid: locusMember.ursTaxid,
          regionId: locusMember.regionId,
          locusId: Number(locusMember.locusId),
          membershipStatus: locusMember.membershipStatus,
        })),
      };
    }

    return baseResponse;
  }
}
