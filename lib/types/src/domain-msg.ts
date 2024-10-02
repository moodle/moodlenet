import { d_u, map } from './map'

export type ok_ko<
  success_result,
  fail_result extends map | void = void,
  fail_du_key extends string = 'reason',
> =
  | readonly [success: true, result: success_result]
  | readonly [
      success: false,
      result: fail_result extends void ? void : d_u<fail_result, fail_du_key>,
    ]

// const _0: ok_ko<void, never> = [, true] as const
// const _1: ok_ko<void, never> = [, false] as const
// const _01: ok_ko<void, never> = [, true]
// const _11: ok_ko<void, never> = [, false]

// const _3: ok_ko<void, void> = [, true] as const
// const _4: ok_ko<void, void> = [, false] as const
// const _31: ok_ko<void, void> = [, true]
// const _41: ok_ko<void, void> = [, false]

// const _32: ok_ko<unknown, unknown> = [, true] as const
// const _42: ok_ko<unknown, unknown> = [, false] as const
// const _321: ok_ko<unknown, unknown> = [, true]
// const _421: ok_ko<unknown, unknown> = [, false]

// const _00: ok_ko<void, never> = [true] as const
// const _10: ok_ko<void, never> = [false] as const
// const _010: ok_ko<void, never> = [true]
// const _110: ok_ko<void, never> = [false]

// const _30: ok_ko<void, void> = [true] as const
// const _40: ok_ko<void, void> = [false] as const
// const _310: ok_ko<void, void> = [true]
// const _410: ok_ko<void, void> = [false]

// const _320: ok_ko<unknown, unknown> = [true] as const
// const _420: ok_ko<unknown, unknown> = [false] as const
// const _3210: ok_ko<unknown, unknown> = [true]
// const _4210: ok_ko<unknown, unknown> = [false]
