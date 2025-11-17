// permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/config/acl';
import { CHECK_ABILITY, RequiredRule } from 'src/casl/decorators/permission.decorator';


@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.getAllAndOverride<RequiredRule[]>(
      CHECK_ABILITY,
      [context.getHandler(), context.getClass()],
    );
    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ability =  await this.caslAbilityFactory.buildAbilityFor(request.user);

    for (const rule of rules) {
      if (!ability.can(rule.action, rule.subject)) {
        throw new ForbiddenException(`No tienes permisos para la accion de ${rule.action}`);
      }
    }

    return true;
  }
}
