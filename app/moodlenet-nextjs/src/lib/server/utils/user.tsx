import { user } from '@moodle/mod/iam'

export function isGuest(user: user) {
  return user.kind === 'guest'
}
