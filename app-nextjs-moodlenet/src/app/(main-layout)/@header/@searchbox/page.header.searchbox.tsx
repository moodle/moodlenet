import { getCtx } from '@/lib-server/ctx'
import ClientHeaderSearchbox from './client.header.searchbox'

export default async function PageHeaderSearchbox() {
  const {
    config: {
      webapp: {
        labels: { searchPlaceholder },
      },
    },
  } = await getCtx()

  return <ClientHeaderSearchbox initialSearchText="" placeholder={searchPlaceholder} />
}
