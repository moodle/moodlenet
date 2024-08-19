import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // const requestHeaders = new Headers(request.headers)
  // requestHeaders.set('x-hello-from-middleware1', 'hello')

  // const sessionCtx = await (await import('@/lib/mock/server/session-ctx/mock')).default()
  // console.log(`*-*\n` || { sessionCtx })
  // const response = await asyncCtx.run({ a: 1 }, () => {
  //;(request as any)._ = { a: 1 }
  return NextResponse.next(/* {
    request: {
      // New request headers
      headers: requestHeaders,
      },
      } */)
  // })

  // Set a new response header `x-hello-from-middleware2`
  // response.headers.set('x-hello-from-middleware2', 'hello')
  // You can also set request headers in NextResponse.rewrite

  // return response
}
