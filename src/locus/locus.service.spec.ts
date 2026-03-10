import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocusService } from './locus.service';
import { LocusEntity } from './entities/locus.entity';
import { LocusMemberEntity } from './entities/locus-member.entity';

describe('LocusService', () => {
  let service: LocusService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const mockLocusRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockLocusMemberRepository = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocusService,
        {
          provide: getRepositoryToken(LocusEntity),
          useValue: mockLocusRepository,
        },
        {
          provide: getRepositoryToken(LocusMemberEntity),
          useValue: mockLocusMemberRepository,
        },
      ],
    }).compile();

    service = module.get<LocusService>(LocusService);
  });

  it('should forbid sideloading for normal user', async () => {
    await expect(
      service.getLocuses(
        {
          sideloading: 'locusMembers' as any,
          sortBy: 'id' as any,
          sortOrder: 'ASC' as any,
          page: 1,
          limit: 1000,
        },
        'normal',
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should apply limited user region filter', async () => {
    await service.getLocuses(
      {
        sortBy: 'id' as any,
        sortOrder: 'ASC' as any,
        page: 1,
        limit: 1000,
      },
      'limited',
    );

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'locusMember.regionId IN (:...limitedRegionIds)',
      {
        limitedRegionIds: [86118093, 86696489, 88186467],
      },
    );
  });

  it('should join locus members when membershipStatus filter is provided', async () => {
    await service.getLocuses(
      {
        membershipStatus: 'highlighted',
        sortBy: 'id' as any,
        sortOrder: 'ASC' as any,
        page: 1,
        limit: 1000,
      },
      'admin',
    );

    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'locus.locusMembers',
      'locusMember',
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'locusMember.membershipStatus = :membershipStatus',
      { membershipStatus: 'highlighted' },
    );
  });
});
