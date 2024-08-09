import { ServerContext } from '@/lib-server/types/context'

export default async function getServerContext() {
  const serverContext: ServerContext = {
    config: {
      webapp: {
        basePath: '/',
        logo: 'https://moodle.net/08469f8073a8f969253823d5d6ed6ffa.png',
        smallLogo: 'https://moodle.net/e80d311942d3ce22651b33968a87ecb1.png',
        user: { permissions: { createDraftContent: true } },
        labels: {
          searchPlaceholder: 'Search for open educational content',
        },
        title: 'Search for resources, subjects, collections or people',
        subtitle: 'Find, share and curate open educational resources',
        landing: {
          slots: {
            head: [],
            content: [],
          },
        },
        mainLayout: {
          header: {
            slots: {
              left: [],
              center: [],
              right: [],
            },
          },
          footer: {
            slots: {
              left: [],
              center: [],
              right: [],
              copyright: [],
            },
          },
        },
      },
    },
  }
  return serverContext
}
