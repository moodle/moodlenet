import { SessionContext } from '@/lib-server/session/types/context'
import { RootLayouts } from '@/lib-server/session/types/website/layouts'

export const roots: SessionContext['website']['layouts']['roots'] = async function rootLayout(k) {
  const rootLayouts: RootLayouts = {
    simple: {
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
          bottom: [],
        },
      },
    },
    main: {
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
          bottom: [],
        },
      },
    },
  }
  return rootLayouts[k]
}
