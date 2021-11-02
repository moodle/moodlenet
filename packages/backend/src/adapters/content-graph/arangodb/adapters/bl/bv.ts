import { BV } from '../../../../../ports/content-graph/graph-lang/base'

export const _aqlBv = <T>(val: string) => `( ${val} )` as BV<T>
