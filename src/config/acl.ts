import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AuthDocument } from 'src/auth/schema/auth.schema';
import { RolesService } from 'src/roles/roles.service';
import { Actions, Subjects } from 'src/types/permission-types';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly roleService: RolesService) {}

  async buildAbilityFor(user: AuthDocument): Promise<AppAbility> {
    const permissions = await this.roleService.finPermissions(user.roles);

    const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

      permissions?.forEach((permission: { action: Actions[]; subject: Subjects; }) => {
        permission.action?.map((action: string) => can(action as Actions, permission.subject));
    })

    return createMongoAbility(rules) as AppAbility; 
  }
}
