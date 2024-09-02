import { _any } from '@moodle/lib/types'
import { factory } from 'domain/src/types'

export function core(): factory<'pri'> {
  return ctx => {
    return {
      moodle: {
        net: {
          V0_1: {
            prm: null as _any,
            // sec: null as _any,
            // emit: null as _any,
            pri: {
              read: {
                async websiteInfo() {
                  return {
                    logo: 'https://moodle.net/08469f8073a8f969253823d5d6ed6ffa.png',
                    smallLogo: 'https://moodle.net/e80d311942d3ce22651b33968a87ecb1.png',
                    title: 'Search for resources, subjects, collections or people',
                    subtitle: 'Find, share and curate open educational resources',
                    deployment: {
                      domain: 'localhost:3000',
                      basePath: '/',
                      secure: false,
                    },
                  }
                },
                async websiteLayouts() {
                  return {
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
                          { label: 'ciccio login', panel: 'ciccio' },
                        ],
                      },
                      signup: {
                        methods: [
                          {
                            label: 'Email and password',
                            panel: 'moodle-email-pwd-authentication',
                          },
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
                  }
                },
              },
            },
          },
        },
      },
    }
  }
}
