import { map, url_path_string } from '@moodle/lib-types'
import QueryString from 'qs'

export type sitepaths = ReturnType<typeof sitepaths>
export function sitepaths<as extends string = url_path_string>(baseUrl = '/') {
  type id = string
  const _ = (path: string) => `${baseUrl}${path}` as as

  const DEF_SLUG = '-'
  const _by_id = (path: string) => (id: id) => `${_(path)}/${id}`
  const _by_id_slug_sub =
    <sub extends string>(path: string) =>
    (id: id, slug = DEF_SLUG) =>
    (sub: sub) =>
      `${_(path)}/${id}/${slug}${sub}` as as

  const _sub =
    <sub extends string>(path: string) =>
    (sub: sub) =>
      `${_(path)}${sub}` as as

  const _with_query = (path: string) => (query?: map<string | string[]>) => {
    const qstring = QueryString.stringify(query)
    return `${_(path)}?${qstring}` as as
  }
  type admin_settings_sub = '/users' | '/general' | '/appearance' | '/moderation'
  const admin_settings = _sub<admin_settings_sub>(`admin`)

  type user_settings_sub = '/advanced' | '/general'
  const user_settings = _sub<user_settings_sub>(`settings`)

  type profile_sub = '/bookmarks' | '/followers' | '/following' | ''
  const profile = _by_id_slug_sub<profile_sub>(`profile`)
  const user = _by_id(`user`)
  const resource = _by_id_slug_sub(`resource`)
  const collection = _by_id_slug_sub(`collection`)
  const subject = _by_id_slug_sub(`subject`)

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
        user,
        resource,
        collection,
        subject,
      },
      admin: {
        settings: admin_settings,
      },
    },
  }
}