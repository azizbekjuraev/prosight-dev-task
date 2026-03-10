import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocusService } from './locus.service';

@ApiTags('locus')
@ApiBearerAuth()
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get locus data' })
  async getLocus(@Query() query: any, @Req() req: any) {
    return this.locusService.findAll(query, req.user);
  }
}
