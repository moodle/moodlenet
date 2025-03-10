import { d_t_u } from '@moodle/lib-types'

export type cursorList<itemData, cursor = string> = [items: cursorListItem<itemData, cursor>[]]
export type cursorListItem<itemData, cursor = string> = [item: itemData, cursor: cursor]
export type pageOpts<filter, order extends string> = {
  order?: [order: order, dir: 'asc' | 'desc'][]
  filter?: filter
  limit?: number | 1
  cursor?: [cursor: string, take: 'after' | 'before']
}

export type filterLogic<f> = _mnot<d_t_u<f> | init<f>>
type init<f> = d_t_u<f> extends infer dtu ? ['OR' | 'AND', _mnot<dtu | more<f>>, _mnot<dtu | more<f>>, ..._mnot<dtu | more<f>>[]] : never
type more<f> = d_t_u<f> extends infer dtu ? [_mnot<dtu>, ..._mnot<dtu>[]] | init<f> : never

//@ts-expect-error : cannot enforce stuff to be a tuple.. nevertheless, seems it works nicely like so ...
type _mnot<stuff> = stuff | ['NOT', ...stuff]

// type y = filterLogic<{ a: 1; b: 2; c: never }>
// // prettier-ignore
// export const x: y = [
//   'OR',
//     ['NOT', 'AND', ['b', 2], ['b', 2]],
//     ['a', 1],
//     ['b', 2],
//     ['AND',
//         ['AND',
//           ['a', 1],
//           ['b', 2],
//         ],
//         ['a', 1],
//       ['b', 2],
//     ],
//     ['NOT', 'AND', ['b', 2], ['b', 2]],
//     ['a', 1]
// ]

// export const x1: y = ['NOT', 'AND', ['a', 1], ['a', 1]]
// export const x2: y = ['AND', ['a', 1], ['c'], ['c'], ['OR', ['b', 2], ['a', 1], ['OR', ['b', 2], ['a', 1]], ['a', 1]]]
// export const x3: y = ['NOT', 'AND', ['NOT', 'c'], ['NOT', 'b', 2], ['b', 2], ['b', 2], ['NOT', ['a', 1]]]
