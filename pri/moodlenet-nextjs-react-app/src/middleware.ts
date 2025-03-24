import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const urlPathname = request.headers.get('X-Forwarded-Pathname') || request.nextUrl.pathname
  const urlHost = request.headers.get('X-Forwarded-Host') || request.nextUrl.host
  const urlPort = request.headers.get('X-Forwarded-Port') || request.nextUrl.port
  const urlProto = (request.headers.get('X-Forwarded-Proto') || request.nextUrl.protocol).toLowerCase()
  // url.host = urlHost
  // url.protocol = urlProto
  // url.port = urlPort

  const xUrl = request.nextUrl.toString()
  const xMode = request.mode
  const xSearch = request.nextUrl.search.replace(/^\?/, '')

  // for (const h of request.headers.entries()) {
  //   console.log(h.join(':'))
  // }
  //! NOTE:  consider this https://www.npmjs.com/package/next-extra ! (or maybe others)
  // or simply implement some utility functins for accessing these  custom data in server-components|actions
  return NextResponse.next({
    headers: {
      'x-mode': xMode,
      'x-url': xUrl,
      'x-host': urlHost,
      'x-proto': urlProto,
      'x-port': urlPort,
      'x-pathname': urlPathname,
      'x-search': xSearch,
    },
  })
}
