/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react'

export default function page(PageCmp: ComponentType<any>) {
  return async function Page(props: any) {
    return <PageCmp {...props} />
  }
}
