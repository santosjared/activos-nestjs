import { Controller, Get, Query} from '@nestjs/common';
import { DepreciacionService } from './depreciacion.service';
import { FiltersDepreciacionDto } from './dto/filters-depreciacion.dto';

@Controller('depreciacion')
export class DepreciacionController {
  constructor(private readonly depreciacionService: DepreciacionService) {}

  @Get()
  findAll(@Query() filters:FiltersDepreciacionDto) {
    return this.depreciacionService.findAll(filters);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.depreciacionService.findOne(+id);
  // }
}
