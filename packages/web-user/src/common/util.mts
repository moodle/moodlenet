import type { UserStatus } from './types.mjs'

export function getUserStatus(
  mix: null | { publisher: boolean; isAdmin: boolean; deleted?: boolean },
): UserStatus {
  if (!mix) return 'Non-authenticated'
  else if (mix.deleted) return 'Deleted'
  else if (mix.isAdmin) return 'Admin'
  else if (mix.publisher) return 'Publisher'
  else if (!mix.publisher) return 'Non-publisher'
  return 'Non-authenticated'
}
