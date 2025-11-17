import { SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from 'src/types/permission-types';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Actions;
  subject: Subjects;
}

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
