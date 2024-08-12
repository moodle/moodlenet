'use server'
import HeaderLogo from '@/components/organisms/Header/HeaderLogo/HeaderLogo'
import { sessionContext } from '@/lib-server/sessionContext'

export async function LayoutHeaderLogo() {
  const {
    website: { info },
  } = await sessionContext()
  const { logo, smallLogo, basePath } = await info()
  return <HeaderLogo {...{ logo, smallLogo, href: basePath }} />
}
