import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const urlHost = request.headers.get('X-Forwarded-Host') || request.nextUrl.host
  const urlPort = request.headers.get('X-Forwarded-Port') || request.nextUrl.port
  const urlPathname = request.nextUrl.pathname
  const urlProto = (
    request.headers.get('X-Forwarded-Proto') || request.nextUrl.protocol
  ).toLowerCase()
  // url.host = urlHost
  // url.protocol = urlProto
  // url.port = urlPort

  const xUrl = request.nextUrl.toString()
  const xClientIp = request.headers.get('X-Forwarded-For') || request.ip || 'unknown'
  const xMode = request.mode
  const xGeo = JSON.stringify(request.geo || {})
  const xSearch = request.nextUrl.search.replace(/^\?/, '')

  //! NOTE:  consider this https://www.npmjs.com/package/next-extra ! (or maybe others)
  // or simply implement some utility functins for accessing these  custom data in server-components|actions
  return NextResponse.next({
    headers: {
      'x-mode': xMode,
      'x-geo': xGeo,
      'x-url': xUrl,
      'x-client-ip': xClientIp,
      'x-host': urlHost,
      'x-proto': urlProto,
      'x-port': urlPort,
      'x-pathname': urlPathname,
      'x-search': xSearch,
    },
  })
}
