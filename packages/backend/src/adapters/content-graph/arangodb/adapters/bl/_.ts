import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'

export const _ = <T>(val: string) => `( ${val} )` as BV<T>
