import { Permissions } from '../../../../lib/server/session/types/permissions'

export async function permission(k: keyof Permissions) {
  const perm: Permissions = {
    createDraftContent: true,
  }

  return perm[k]
}
