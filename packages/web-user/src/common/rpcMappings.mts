import { href } from '@moodlenet/react-app/common'
import type {
  UserReport,
  UserReportRPC,
  UserStatus,
  UserStatusChange,
  UserStatusChangeRPC,
} from './types.mjs'
import { getProfileHomePageRoutePath } from './webapp-routes.mjs'

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

export function userReportRPC2UserReport({ date, reason, user }: UserReportRPC): UserReport {
  return {
    date,
    reason,
    user: {
      displayName: user.displayName,
      email: user.email,
      profileHref: href(
        getProfileHomePageRoutePath({
          _key: user.profileKey,
          displayName: user.displayName,
        }),
      ),
    },
  }
}

export function UserStatusChangeRPC2UserStatusChange({
  status,
  date,
  userChangedStatus: { displayName, email, profileKey },
}: UserStatusChangeRPC): UserStatusChange {
  return {
    status,
    date,
    userChangedStatus: {
      displayName,
      email,
      profileHref: href(getProfileHomePageRoutePath({ _key: profileKey, displayName })),
    },
  }
}
