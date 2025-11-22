import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bitacoras } from '../schema/bitacoras.schema';
import { Observable, tap } from 'rxjs';
import { BITACORA_KEY } from '../decorator/bitacora.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BitacoraInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        @InjectModel(Bitacoras.name) private bitacoraModel: Model<Bitacoras>,
        private readonly userService: UsersService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const action = this.reflector.get<string>(
            BITACORA_KEY,
            context.getHandler(),
        );
        if (!action) return next.handle();

        const request = context.switchToHttp().getRequest();
        const userId = request.user?._id;
        const method = request.method;
        const url = request.url;
        const params = request.params;
        const body = request.body;
        let user: any = null;
        if (userId) {
            user = await this.userService.findOne(userId.toString());
        }

        return next.handle().pipe(
            tap(async () => {
                await this.bitacoraModel.create({
                    user: user?._id || null,
                    action,
                    method,
                    logs: JSON.stringify({ url, params, body }),
                });
            }),
        );
    }
}
