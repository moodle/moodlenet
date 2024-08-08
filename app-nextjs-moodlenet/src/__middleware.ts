import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')
  // console.log(`***\n`.repeat(10), requestHeaders, `***\n`.repeat(10))

  // You can also set request headers in NextResponse.rewrite
  const response =
    NextResponse.next(/* {
    request: {
      // New request headers
      headers: requestHeaders,
    },
  } */)

  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
