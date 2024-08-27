import { Layouts } from '../../types/website/layouts'

export const layouts: Layouts = {
  pages: {
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
  },
  roots: {
    main: {
      footer: { slots: { bottom: [], center: [], left: [], right: [] } },
      header: { slots: { center: [], left: [], right: [] } },
    },
    simple: {
      footer: { slots: { bottom: [], center: [], left: [], right: [] } },
      header: { slots: { center: [], left: [], right: [] } },
    },
  },
}
