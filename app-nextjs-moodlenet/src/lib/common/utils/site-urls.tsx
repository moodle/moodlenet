export type siteUrls = ReturnType<typeof siteUrls>
export function siteUrls(baseUrl = '') {
  type id = string

  return {
    homepages: {
      profile: (id: id, slug = '') => _(`profile/${id}/${slug}`),
    },
    landing: '/',
    access: {
      login: _('login'),
      signup: _('signup'),
    },
  }

  function _(_: string) {
    return `${baseUrl}/${_}`
  }
}
