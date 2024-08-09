import { ServerContext } from '@/lib-server/types/context'

export default async function getServerContext() {
  const serverContext: ServerContext = {
    config: {
      webapp: {
        user: { permissions: { createDraftContent: true } },
        labels: {
          searchPlaceholder: 'Search for open educational content',
        },
        title: 'Search for resources, subjects, collections or people',
        subtitle: 'Find, share and curate open educational resources',
        landing: {
          slots: {
            header: [],
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
