import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Auth, AuthDocument } from "src/auth/schema/auth.schema";
import { Permission, PermissionDocument } from "src/roles/schema/permission.schema";
import { Rol, RolDocument } from "src/roles/schema/roles.schema";
import { Users, UsersDocument } from "src/users/schema/users.schema";
import { permissions } from "src/utils/permissions";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthSeedService {
    constructor(
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
        @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
        @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
        private readonly configService: ConfigService
    ) { }

    async seed() {

        try {
            console.log('Ejecuntando seed de Auth...');
            const ROOT_EMAIL = this.configService.get<string>('ROOT_EMAIL') ?? 'admin@gmail.com';
            const ROOT_PASSWORD = this.configService.get<string>('ROOT_PASSWORD') ?? 'admin123';
            const ROOT_NAME = this.configService.get<string>('ROOT_NAME') ?? 'Admin';

            if (ROOT_PASSWORD.length < 8) {
                throw new Error('ROOT_PASSWORD debe tener mínimo 8 caracteres');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(ROOT_EMAIL)) {
                throw new Error('ROOT_EMAIL debe ser un correo válido');
            }

            let ROOT_ROL = await this.rolModel.findOne({ isRoot: true });

            await this.permissionModel.deleteMany({ isRoot: true });

            const permissionsIds = await Promise.all(
                permissions.map(async (permission) => {
                    const perm = new this.permissionModel({ ...permission, isRoot: true });
                    await perm.save();
                    return perm._id;
                }
                )
            );

            if (!ROOT_ROL) {
                ROOT_ROL = new this.rolModel({ name: 'Root', isRoot: true, permissions: permissionsIds });
                await ROOT_ROL.save();
            } else {
                ROOT_ROL.permissions = permissionsIds;
                await ROOT_ROL.save();
            }
            let rootAuth = await this.authModel.findOne({ isRoot: true });
            const passwordHash = await bcrypt.hash(ROOT_PASSWORD, 10);
            if (!rootAuth) {
                rootAuth = new this.authModel({
                    email: ROOT_EMAIL,
                    password: passwordHash,
                    fullName: ROOT_NAME,
                    rol: [ROOT_ROL._id],
                    isRoot: true
                });
                await rootAuth.save();
            } else {
                rootAuth.email = ROOT_EMAIL;
                rootAuth.password = passwordHash;
                rootAuth.fullName = ROOT_NAME;
                rootAuth.roles = [ROOT_ROL._id];
                await rootAuth.save();
            }

            const rootUserData: Users = {
                name: ROOT_NAME,
                email: ROOT_EMAIL,
                auth: rootAuth._id,
                isRoot: true,
                tipo:'System'
            };
            const existingRootUser = await this.userModel.findOne({ isRoot: true, $or: [{ email: ROOT_EMAIL }] });
            if (existingRootUser) {
                await this.userModel.findByIdAndUpdate(existingRootUser._id, rootUserData);
            } else {
                await this.userModel.create(rootUserData);
            }
            console.log('Seed complete Auth ✅');
        } catch (error) {
            console.error('Error seeding Auth:', error);
        }
    }
}