/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import { void as voidz } from 'zod'
import { userId, userProfile } from '../../../../../model/userAccount.model'

export type read = moo.persona.endpoint<[typeof readSchema, { userId: userId; profile: userProfile }]>

const readSchema = voidz()
export const read: moo.gate.provider.endpoint<read> = flow(
  E.right,
  E.bind('zod', () => E.right(readSchema)),
)
