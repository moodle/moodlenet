import { map } from '@moodle/lib-types'
import QueryString from 'qs'

export type sitepaths = ReturnType<typeof sitepaths>
export function sitepaths(baseUrl = '/') {
  type id = string
  const _ = (path: string) => `${baseUrl}${path}`

  const DEF_SLUG = '-'
  const _id_slug_sub =
    <sub extends string>(path: string) =>
    (id: id, slug = DEF_SLUG) =>
    (sub: sub) =>
      `${_(path)}/${id}/${slug}${sub}`

  const _sub =
    <sub extends string>(path: string) =>
    (sub: sub) =>
      `${_(path)}${sub}`

  const _with_query = (path: string) => (query?: map<string | string[]>) => {
    const qstring = QueryString.stringify(query)
    return `${_(path)}?${qstring}`
  }
  type admin_sub = '/users' | '/general' | '/appearance'
  const admin = _sub<admin_sub>(`admin`)

  type user_settings_sub = '/advanced' | '/general'
  const user_settings = _sub<user_settings_sub>(`settings`)

  type profile_sub = '/bookmarks' | '/followers' | '/following' | ''
  const profile = _id_slug_sub<profile_sub>(`profile`)
  const resource = _id_slug_sub(`resource`)
  const collection = _id_slug_sub(`collection`)
  const subject = _id_slug_sub(`subject`)

  return {
    apis: {
      iam: {
        basicAuth: {
          verifySignupEmailToken: _('-/api/iam/basic-auth/verify-signup-email-token'),
        },
        deleteMyAccountRequest: {
          confirm: _('-/api/iam/delete-my-account-request/confirm'),
        },
      },
    },
    pages: {
      landing: baseUrl,
      access: {
        login: _with_query('login'),
        signup: _('signup'),
        recoverPasswordRequest: _sub<'' | '/reset'>('recover-password-request'),
      },
      user: {
        settings: user_settings,
      },
      homepages: {
        profile,
        resource,
        collection,
        subject,
      },
      admin,
    },
  }
}
