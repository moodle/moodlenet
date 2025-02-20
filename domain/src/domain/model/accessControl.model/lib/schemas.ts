import { literal } from 'zod'

export function getPermissionsSchema() {
  const role = literal('admin').or(literal('contributor')).or(literal('viewer'))
  return {
    role,
  }
}
