// import { sessionContext } from '@/lib/server/sessionContext'
// import { siteUrls } from '@/lib/common/utils/site-urls'
// import { redirect } from 'next/navigation'

// export default async function LoginBasePathPage() {
//   siteUrls().access.login
//   const { website } = await sessionContext()
//   const layout = await website.layouts.pages('login')
//   redirect(`${siteUrls().access.login}/${layout.methods[0].url}`)
// }
export default async function LoginBasePathPage() {
  return null
}
