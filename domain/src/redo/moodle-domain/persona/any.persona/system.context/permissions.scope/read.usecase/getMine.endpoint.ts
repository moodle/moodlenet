/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { void as voidz, ZodVoid } from 'zod'

export type getMine = moo.DefUseCaseEndpoint<[ZodVoid, { permissions: moo.Permissions }, undefined]>

export const getMine_Gate = (() => E.right({ zod: voidz() })) satisfies moo.Gate_Endpoint_Provider<getMine>
