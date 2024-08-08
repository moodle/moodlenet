import { ServerContext } from '@/lib-server/types/context'

export default async function getServerContext() {
  const serverContext: ServerContext = {
    config: {
      webapp: {
        labels: {
          searchPlaceholder: 'Search for open educational content',
        },
        title: 'Search for resources, subjects, collections or people',
        subtitle: 'Find, share and curate open educational resources',
        landing: {
          slots: {
            header: ['shareButton'],
            content: [],
          },
        },
        mainLayout: {
          header: {
            slots: {
              left: [],
              center: ['searchbox'],
              right: [
                //  'rightItems',
                // {
                //   type: 'div',
                //   props: { children: 'alalala', style: { background: 'red' } },
                //   key: 'ooo',
                // },
              ],
            },
          },
          footer: {
            slots: {
              left: [],
              center: [],
              right: [
                // 'rightItems'
              ],
              copyright: [],
            },
          },
        },
      },
    },
  }
  return serverContext
}
