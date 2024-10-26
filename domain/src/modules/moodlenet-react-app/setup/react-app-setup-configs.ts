import { Configs } from '../types'

export const moodlenet_react_app_default_configs: Configs = {
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
            panel: ['plugin', 'login-email-pwd'],
          },
        ],
      },
      signup: {
        methods: [
          {
            label: ['html', 'Email and password'],
            panel: ['plugin', 'signup-email-pwd'],
          },
        ],
        slots: {
          subCard: [],
        },
      },
    },
  },
}
