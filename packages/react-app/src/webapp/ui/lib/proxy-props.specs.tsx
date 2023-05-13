import type { ProxyProps, withProxy } from './proxy-props.js'

type MyProps = { a: 1; b: 2; c: 3 }
declare const CtrledComp: ReturnType<typeof withProxy<MyProps>>

declare const cp: ProxyProps<MyProps>
declare const cpa: ProxyProps<Pick<MyProps, 'a'>>
declare const cpab: ProxyProps<Omit<MyProps, 'c'>>
declare const cpx: ProxyProps<{ x: 1 }>
declare const cpy: ProxyProps<never>
;<>
  <CtrledComp {...cp} />
  <CtrledComp {...{ ...cp }} />
  <CtrledComp {...{ ...cp, ...{} }} />
  <CtrledComp {...{ ...cp, ...{ a: 1 } }} />
  <CtrledComp {...{ ...cpa, ...{ b: 2, c: 3 } }} />
  <CtrledComp {...{ ...cpab, ...{ c: 3 } }} />
  <CtrledComp {...{ ...cpab, ...{ a: 1, c: 3 } }} />
  <CtrledComp {...{ ...cpx, ...{ a: 1, b: 2, c: 3 } }} />
  <CtrledComp {...{ ...cpab, ...{ a: 1, b: 2, c: 3 } }} />
  <CtrledComp {...{ a: 1, b: 2, c: 3 }} />
  <CtrledComp {...cp} />
</>
;<>
  {/* @ts-expect-error check */}
  <CtrledComp {...{ a: 1, b: 2 }} />

  {/* @ts-expect-error check */}
  <CtrledComp {...{ ...cpx, ...{ a: 1, b: 2 } }} />

  {/* @ts-expect-error check */}
  <CtrledComp {...{ ...cpx, ...{ a: 1 } }} />

  {/* @ts-expect-error check */}
  <CtrledComp {...cpa} />

  {/* @ts-expect-error check */}
  <CtrledComp {...cpab} />

  {/* @ts-expect-error check */}
  <CtrledComp {...{ ...cpx }} />

  {/* @ts-expect-error check */}
  <CtrledComp {...cpx} />

  {/* @ts-expect-error check */}
  <CtrledComp {...cpy} />

  {/* @ts-expect-error check */}
  <CtrledComp {...{ ...cpy, ...{ a: 1, b: 2, c: 3 } }} />
</>
