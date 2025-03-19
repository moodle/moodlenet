import { u_entry } from '@moodle/lib-types'

export type cursorList<itemData /* , cursor = number */> = { items: itemData[] } //; cursors: [cursor, cursor] } //; hasMore: boolean }
export type pageOpts<filter /* , order extends string, cursor = number */> = {
  // order?: [order: order, dir?: 'asc' | 'desc'][]
  filters?: filter[]
  limit?: number | 1
  // cursor?: [cursor: cursor, take?: 'after' | 'before']
}

export type filterBoolTree<f> = _filterBoolTree_not<u_entry<f> | _filterBoolTree_block<f>>
type _filterBoolTree_block<f> =
  u_entry<f> extends infer dtu
    ? [
        'OR' | 'AND',
        _filterBoolTree_not<dtu | _filterBoolTree_rest<f>>,
        _filterBoolTree_not<dtu | _filterBoolTree_rest<f>>,
        ..._filterBoolTree_not<dtu | _filterBoolTree_rest<f>>[],
      ]
    : never
type _filterBoolTree_rest<f> = u_entry<f> extends infer dtu ? [_filterBoolTree_not<dtu>, ..._filterBoolTree_not<dtu>[]] | _filterBoolTree_block<f> : never

//@ts-expect-error : cannot enforce stuff to be a tuple.. nevertheless, seems it works nicely like so ...
type _filterBoolTree_not<stuff> = stuff | ['NOT', ...stuff]

// type y = filterBoolTree<{ a: 1; b: 2; c: never }>
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
