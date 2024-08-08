import { ServerContext } from '@/lib-server/types/context'

export default async function getServerContext() {
  const serverContext: ServerContext = {
    config: {
      webapp: {
        mainLayout: {
          landing: {
            slots: {
              hero: ['defaultHero'],
              content: [],
            },
          },
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
