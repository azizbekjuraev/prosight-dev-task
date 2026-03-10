import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocusService } from './locus.service';
import { GetLocusQueryDto } from './dto/locus-query.dto';

@ApiTags('locus')
@ApiBearerAuth()
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get locus data' })
  @ApiResponse({ status: 200, description: 'OK' })
  getLocus(@Query() query: GetLocusQueryDto, @Req() request: any) {
    return this.locusService.getLocuses(query, request.user.role);
  }
}
