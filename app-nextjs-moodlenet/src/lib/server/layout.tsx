/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react'

export default function layout(LayoutCmp: ComponentType<any>) {
  return async function Layout(props: any) {
    return <LayoutCmp {...props} />
  }
}
