import { BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'

export const _ = <T>(val: string) => `( ${val} )` as BV<T>
