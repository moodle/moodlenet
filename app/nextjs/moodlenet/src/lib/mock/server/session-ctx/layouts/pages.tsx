import { SessionContext } from '@/lib/server/session/types/context'
import { PageLayouts } from '@/lib/server/session/types/website/layouts'

export const pages: SessionContext['website']['layouts']['pages'] = async function pageLayout(k) {
  const pageLayouts: PageLayouts = {
    landing: {
      slots: {
        head: [],
        content: [],
      },
    },
    login: {
      methods: [
        { label: 'Email and password', panel: 'moodle-email-pwd-authentication' },
        { label: 'ciccio login', panel: 'ciccio' },
      ],
    },
    signup: {
      methods: [
        { label: 'Email and password', panel: 'moodle-email-pwd-authentication' },
        { label: 'ciccio signup', panel: 'ciccio' },
      ],
      slots: {
        subCard: [
          `<a key="terms" href="http://moodle.com" target="__blank">
            <span>You agree to our Terms &amp; Conditions</span>
          </a>`,
        ],
      },
    },
  }

  return pageLayouts[k]
}