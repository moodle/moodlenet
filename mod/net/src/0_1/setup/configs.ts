import { Configs } from '../types'

export const defaultNetConfigs_0_1: Configs = {
  info: {
    logo: 'https://moodle.net/08469f8073a8f969253823d5d6ed6ffa.png',
    smallLogo: 'https://moodle.net/e80d311942d3ce22651b33968a87ecb1.png',
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
  },
  deployment: {
    domain: 'localhost:3000',
    basePath: '/',
    secure: false,
  },
  websiteLayouts: {
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
            panel: 'moodle-email-pwd-authentication',
          },
        ],
      },
      signup: {
        methods: [
          {
            label: 'Email and password',
            panel: 'moodle-email-pwd-authentication',
          },
        ],
        slots: {
          subCard: [],
        },
      },
    },
  },
}
