/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type getMyOwn = moo.persona.endpoint<[ZodVoid, { session: moo.session.user; token: signed_token }, undefined]>

export const getMyOwn: moo.gate.endpoint<getMyOwn> = () => E.right({ zod: voidz() })
