import { _maybe, createPathProxy, map, url_path_string } from '@moodle/lib-types'
import QueryString from 'qs'

export function createSitepaths<path_type extends string = url_path_string>(baseUrl = '/') {
  const paths = createPathProxy<sitePaths<path_type>, _maybe<{ query?: map<string | string[]> }>>({
    apply({ path, arg }) {
      const qstring = arg?.query ? `?${QueryString.stringify(arg.query)}` : ''
      return `${baseUrl}${path.join('/')}${qstring}` as path_type
    },
  })
  return paths
}
export const sitepaths = createSitepaths()
type sitePathConstructor<t> = (_?: { query?: map<string | string[]> }) => t
type spc<t> = sitePathConstructor<t>

export type sitePaths<t extends string> = spc<t> & {
  '-': {
    api: {
      iam: {
        'basic-auth': {
          'verify-signup-email-token': spc<t>
        }
        'delete-my-account-request': {
          confirm: spc<t>
        }
      }
    }
  }
  'login': spc<t>
  'signup': spc<t>
  'recover-password-request': spc<t> & {
    reset: spc<t>
  }
  'settings': {
    general: spc<t>
    advanced: spc<t>
  }
  'admin': {
    general: spc<t>
    users: spc<t>
    appearance: spc<t>
    moderation: spc<t>
  }
  'profile': {
    [id: string]: spc<t> & {
      [slug: string]: spc<t> & {
        bookmarks: spc<t>
        followers: spc<t>
        following: spc<t>
      }
    }
  }
  'user-profile': {
    [id: string]: spc<t>
  }
  'resource': {
    [id: string]: spc<t> & {
      [slug: string]: spc<t>
    }
  }
  'collection': {
    [id: string]: spc<t> & {
      [slug: string]: spc<t>
    }
  }
  'subject': spc<t> & {
    [id: string]: {
      [slug: string]: spc<t>
    }
  }
}
