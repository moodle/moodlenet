/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { void as voidz, ZodVoid } from 'zod'

export type invalidateSession = moo.persona.endpoint<[ZodVoid, Option<{ userSessionData: moo.session.user }>, void]>

export const invalidateSession_Gate: moo.gate.endpoint<invalidateSession> = () => E.right({ zod: voidz() })
