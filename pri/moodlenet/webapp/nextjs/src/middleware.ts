import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const mode = request.mode
  mode && request.headers.set('x-mode', mode)

  const geo = request.geo || {}
  request.headers.set('x-geo', JSON.stringify(geo))

  // const isProduction = process.env.NODE_ENV === 'production' // redirect only in production

  const url = request.nextUrl.clone()
  const urlHost = request.headers.get('X-Forwarded-Host') || url.host
  const urlPort = request.headers.get('X-Forwarded-Port') || url.port
  const urlPath = url.pathname
  const urlProto = (request.headers.get('X-Forwarded-Proto') || url.protocol).toLowerCase()
  url.host = urlHost
  url.protocol = urlProto
  url.port = urlPort
  console.log({ url })
  const xUrl = url.toString()
  const xClientIp = request.headers.get('X-Forwarded-For') || request.ip || 'unknown'
  const xMode = request.mode
  const xGeo = JSON.stringify(request.geo || {})
  const xSearch = url.search.replace(/^\?/, '')

  //! NOTE:  consider this https://www.npmjs.com/package/next-extra ! (or maybe others)
  // or simply implement some utility functins for accessing these  custom data in server-components|actions

  return NextResponse.next({
    headers: {
      'x-mode': xMode,
      'x-url': xUrl,
      'x-client-ip': xClientIp,
      'x-geo': xGeo,
      'x-host': urlHost,
      'x-proto': urlProto,
      'x-port': urlPort,
      'x-path': urlPath,
      'x-search': xSearch,
    },
  })
  // const response =
  //   await NextResponse.next(/* {
  //   request: {
  //     // New request headers
  //     // headers: request.headers.append('x-ip',ip)),
  //     },
  //     } */)
  // // })

  // // Set a new response header `x-hello-from-middleware2`
  // // response.headers.set('x-hello-from-middleware2', 'hello')
  // // You can also set request headers in NextResponse.rewrite

  // return response
}
