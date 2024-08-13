import { SessionContext } from '@/lib/server/session/types/context'
import { PageLayouts } from '@/lib/server/session/types/website/layouts'

export const pages: SessionContext['website']['layouts']['pages'] = async function pageLayout(k) {
  const pageLayouts: PageLayouts = {
    landing: {
      slots: {
        head: [],
        content: [],
      },
    },
    login: {
      methods: [
        { label: 'Use email', item: 'emailPwd' },
        { label: 'ciccio pwd', item: 'ciccio' },
      ],
    },
  }

  return pageLayouts[k]
}
