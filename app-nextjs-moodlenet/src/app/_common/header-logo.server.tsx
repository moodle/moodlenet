'use server'
import HeaderLogo from '@/components/organisms/Header/HeaderLogo/HeaderLogo'
import { serverUtils } from '@/lib-server/utils'

export async function LayoutHeaderLogo() {
  const srvUtils = await serverUtils()
  const {
    ctx: {
      session: {
        website: { logo, smallLogo, basePath },
      },
    },
  } = srvUtils
  return <HeaderLogo {...{ logo, smallLogo, href: basePath }} />
}
