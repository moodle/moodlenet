import { Configs } from '../types'

export const net_webapp_nextjs_default_configs: Configs = {
  deployment: {
    domain: 'localhost:3000',
    basePath: '/',
    secure: false,
  },
  layouts: {
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
    pages: {
      landing: { slots: { head: [], content: [] } },
      login: {
        methods: [
          {
            label: 'Email and password',
            panel: 'moodle-iam-basic',
          },
        ],
      },
      signup: {
        methods: [
          {
            label: 'Email and password',
            panel: 'moodle-iam-basic',
          },
        ],
        slots: {
          subCard: [],
        },
      },
    },
  },
}
