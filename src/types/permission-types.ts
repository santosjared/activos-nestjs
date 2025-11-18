export type Actions = 'create' | 'read' | 'update' | 'delete' | 'permissions' | 'details' | 'print' | 'calcular' | 'up' | 'dow' | 'upload'
export type Subjects = 'dashboard' | 'users' | 'roles' | 'activos' | 'contable' | 'entrega' | 'devolucion' | 'bitacora' | 'depreciacion'

export type PermissionType = {
  subject: Subjects
  action: Actions[]
}
