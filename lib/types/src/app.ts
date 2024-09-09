import { d_u } from './map'

export type successFail<success, fail> = d_u<
  {
    success: success
    fail: fail
  },
  'result'
>
