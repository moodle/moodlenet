export type sitepaths = ReturnType<typeof sitepaths>
export function sitepaths(baseUrl = '/') {
  type id = string
  const _ = (path: string) => `${baseUrl}${path}`

  const DEF_SLUG = '-'
  const __ =
    <sub extends string>(path: string) =>
    (id: id, slug = DEF_SLUG) =>
    (sub: sub) =>
      `${_(path)}/${id}/${slug}${sub}`

  type admin_sub = '/users' | '/general' | '/appearance'
  const admin = (sub: admin_sub = '/general') => _(`admin${sub}`)

  type profile_sub = '/settings' | '/bookmarks' | '/followers' | '/following' | ''
  const profile = __<profile_sub>(`profile`)
  const resource = __(`resource`)
  const collection = __(`collection`)
  const subject = __(`subject`)

  return {
    apis: {
      iam: {
        basicAuth: {
          verifySignupEmailToken: _('-/api/iam/basic-auth/verify-signup-email-token'),
        },
      },
    },
    pages: {
      landing: baseUrl,
      access: {
        login: _('login'),
        signup: _('signup'),
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
