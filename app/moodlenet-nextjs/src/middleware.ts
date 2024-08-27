import { NextResponse } from 'next/server'

export async function middleware(/* request: NextRequest */) {
  const response =
    await NextResponse.next(/* {
    request: {
      // New request headers
      headers: requestHeaders,
      },
      } */)
  // })

  // Set a new response header `x-hello-from-middleware2`
  // response.headers.set('x-hello-from-middleware2', 'hello')
  // You can also set request headers in NextResponse.rewrite

  return response
}
