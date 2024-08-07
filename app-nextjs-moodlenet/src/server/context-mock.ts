import { ServerContext } from './types/context'

const factories: ServerContext = {
  config: {
    webapp: {
      mainLayout: {
        header: {
          slots: {
            left: [],
            center: [],
            right: ['rightItems', { type: 'div', props: { children: 'alalala' }, key: 'ooo' }],
          },
        },
        footer: {
          slots: {
            left: [],
            center: [],
            right: ['rightItems'],
            copyright: [],
          },
        },
      },
    },
  },
}
export default factories
