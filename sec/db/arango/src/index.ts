import { factory } from '@moodle/domain'

export interface ArangoConfigs {
  arangodbUrl: string
}
export function db_sec_arango(_: ArangoConfigs): factory<'sec'> {
  return ctx => {
    return {
      moodle: {
        net: {
          V0_1: {
            sec: {
              website: {
                async info() {
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
                async layouts() {
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
        eml_pwd_auth: {
          V0_1: {
            sec: {
              read: {
                async configs() {
                  return {
                    configs: {
                      loginForm: {
                        email: { min: 5, max: 35 },
                        password: { min: 8, max: 35 },
                      },
                      signupForm: {
                        email: { min: 5, max: 35 },
                        password: { min: 8, max: 35 },
                        displayName: { min: 3, max: 35 },
                      },
                    },
                  }
                },
              },
            },
          },
        },
        iam: {
          V0_1: {
            sec: {
              userSession: {
                async validate({ primarySession }) {
                  const authToken = primarySession.session.authToken
                  return !authToken
                    ? {
                        user: { type: 'guest' } as const,
                        permissions: {
                          moodle: {
                            eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                            iam: { V0_1: { prm: undefined } },
                            net: { V0_1: { prm: undefined } },
                          },
                        },
                      }
                    : {
                        user: { type: 'authenticated', id: authToken },
                        permissions: {
                          moodle: {
                            eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                            iam: { V0_1: { prm: undefined } },
                            net: { V0_1: { prm: undefined } },
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
