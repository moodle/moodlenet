import { Configs } from '../types'

export const net_webapp_nextjs_default_configs: Configs = {
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
            label: ['html', 'Email and password'],
            panel: ['slot', 'login-email-pwd'],
          },
        ],
      },
      signup: {
        methods: [
          {
            label: ['html', 'Email and password'],
            panel: ['slot', 'signup-email-pwd'],
          },
        ],
        slots: {
          subCard: [],
        },
      },
    },
  },
}
