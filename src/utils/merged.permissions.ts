import { PermissionType } from "src/types/permission-types";

export const mergePermissions = (permissions: PermissionType[]): PermissionType[] => {
    const merged: Record<string, PermissionType> = {};

    for (const perm of permissions ?? []) {
        const key = perm.subject;

        if (!merged[key]) {
            merged[key] = {
                ...perm,
                action: [...new Set(perm.action)],
            };
        } else {
            const combinedActions = new Set([
                ...merged[key].action,
                ...perm.action
            ]);
            merged[key].action = Array.from(combinedActions);
        }
    }

    return Object.values(merged);
};
