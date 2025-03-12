/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type myOwn = moo.persona.endpoint<[ZodVoid, { permissionsInfo: moo.permissions.user.info }, undefined]>

export const myOwn: moo.gate.provider.endpoint<myOwn> = () => E.right({ zod: voidz() })
