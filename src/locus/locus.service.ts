import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class LocusService {
  async findAll(query: any, user: any) {
    if (user.role === 'normal' && query.sideloading) {
      throw new ForbiddenException('Normal user cannot use sideloading');
    }

    return [
      {
        message: 'Locus endpoint works',
        userRole: user.role,
        query,
      },
    ];
  }
}
