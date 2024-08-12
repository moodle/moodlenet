import { SessionContext } from '@/lib-server/session/types/context'
import { ComponentLayouts } from '@/lib-server/session/types/website/layouts'

export const components: SessionContext['website']['layouts']['components'] =
  async function componentLayout(k) {
    const comps: ComponentLayouts = {
      searchbox: {
        placeholder: 'Search for open educational content',
      },
    }
    return comps[k]
  }
