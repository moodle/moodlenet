'use server'
import { sessionContext } from '@/lib/server/sessionContext'
import HeaderLogo from '@/ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const {
    website: { info },
  } = await sessionContext()
  const { logo, smallLogo, basePath } = await info()
  return <HeaderLogo {...{ logo, smallLogo, href: basePath }} />
}
