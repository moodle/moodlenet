import { href } from '@moodlenet/react-app/common'
import type { UserReport, UserReportRPC, UserStatusChange, UserStatusChangeRPC } from '../types.mjs'
import { getProfileHomePageRoutePath } from '../webapp-routes.mjs'

export function userReportRPC2UserReport({
  date,
  reason,
  status,
  user,
}: UserReportRPC): UserReport {
  return {
    date,
    reason,
    status,
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
