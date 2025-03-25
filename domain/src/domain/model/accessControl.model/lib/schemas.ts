import { literal } from 'zod'

export function getPoliciesSchema() {
  const role = literal('admin').or(literal('contributor')).or(literal('viewer'))
  return {
    role,
  }
}

// type z_userRole = _infer<ReturnType<typeof getPoliciesSchema>['role']>
// const _: z_userRole extends userRole ? (userRole extends z_userRole ? 1 : 0) : 0 = 1
