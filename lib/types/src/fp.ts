import { Either } from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { any_ } from './data'

export type inferO<o> = o extends Option<infer t> ? t : o extends (...args: any_[]) => Option<infer t> ? t : never
export type inferRight<e> =
  e extends Either<any_, infer r> ? r : e extends (...args: any_[]) => Either<any_, infer r> ? r : never
export type inferLeft<e> =
  e extends Either<infer l, any_> ? l : e extends (...args: any_[]) => Either<infer l, any_> ? l : never
