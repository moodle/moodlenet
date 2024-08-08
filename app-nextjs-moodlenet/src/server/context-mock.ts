import { ServerContext } from './types/context'

export default async function getServerContext() {
  const serverContext: ServerContext = {
    config: {
      webapp: {
        mainLayout: {
          header: {
            slots: {
              left: [],
              center: [],
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
