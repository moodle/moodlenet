import './LandingPage.scss'
// import defaultBackground from '@/assets/img/default-landing-background.png'

import { headers } from 'next/headers'
import { userAgent } from 'next/server'

export default async function LandingPage() {
  return (
    <div className="landing">
      <C />
    </div>
  )
}

async function C() {
  const headersList = headers()
  const referer = headersList.get('accept-encoding')
  return (
    false || (
      <pre style={{ position: 'absolute', border: '2px solid black', zIndex: 10000 }}>
        Referer:{referer}
        <br />
        userAgent:{JSON.stringify(userAgent({ headers: headersList }), null, 2)}
      </pre>
    )
  )
}
