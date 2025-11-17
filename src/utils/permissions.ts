import { Actions, Subjects } from 'src/types/permission-types';

export type Permission = {
  subject: Subjects
  action: Actions[]
}
export const permissions: Permission[] = [
    { subject: 'dashboard', action: ['read'] },
    { subject: 'users', action: ['read', 'create', 'update', 'delete', 'up', 'dow'] },
    { subject: 'roles', action: ['read', 'create', 'update', 'delete','permissions'] },
    { subject: 'activos', action: ['read', 'create', 'update', 'delete'] },
    { subject: 'contable', action: ['read', 'create', 'update', 'delete'] },
    { subject: 'entrega', action: ['read', 'create', 'update', 'delete', 'details', 'print'] },
    { subject: 'devolucion', action: ['read', 'create', 'update', 'delete', 'details', 'print'] },
    { subject: 'depreciacion', action: ['read', 'calcular'] },
    { subject: 'bitacora', action: ['read'] },
];