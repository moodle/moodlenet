import { infer as _infer, literal } from 'zod'
import { userRole } from '../types'

type z_userRole = _infer<ReturnType<typeof getPermissionsSchema>['role']>
const _: z_userRole extends userRole ? (userRole extends z_userRole ? 1 : 0) : 0 = 1

export function getPermissionsSchema() {
  const role = literal('admin').or(literal('contributor')).or(literal('viewer'))
  return {
    role,
  }
}
