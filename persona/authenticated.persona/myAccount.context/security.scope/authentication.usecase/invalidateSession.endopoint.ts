/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { void as voidz, ZodVoid } from 'zod'

export type invalidateSession = moo.persona.endpoint<[ZodVoid, Option<{ userSessionData: moo.permissions.user.tree }>, void]>

export const invalidateSession: moo.gate.provider.endpoint<invalidateSession> = () => E.right({ zod: voidz() })
