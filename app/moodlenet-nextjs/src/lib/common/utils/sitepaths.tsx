export type sitepaths = ReturnType<typeof sitepaths>
export function sitepaths(baseUrl = '/') {
  type id = string

  return {
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
    user: {
      bookmarks: profileBookmarks,
      followers: profileFollowers,
      following: profileFollowing,
      settings: profileSettings,
    },
    admin: {
      main: admin,
      users: adminUsers,
    },
  }
  function adminUsers() {
    return `${admin()}/users`
  }
  function admin() {
    return _(`admin`)
  }
  function profileSettings(id: id, slug = '') {
    return `${profile(id, slug)}/settings`
  }
  function profileBookmarks(id: id, slug = '') {
    return `${profile(id, slug)}/bookmarks`
  }
  function profileFollowers(id: id, slug = '') {
    return `${profile(id, slug)}/followers`
  }
  function profileFollowing(id: id, slug = '') {
    return `${profile(id, slug)}/following`
  }
  function profile(id: id, slug = '') {
    return _(`profile/${id}/${slug}`)
  }
  function resource(id: id, slug = '') {
    return _(`resource/${id}/${slug}`)
  }
  function collection(id: id, slug = '') {
    return _(`collection/${id}/${slug}`)
  }
  function subject(id: id, slug = '') {
    return _(`subject/${id}/${slug}`)
  }
  function _(path: string) {
    return `${baseUrl}${path}`
  }
}
