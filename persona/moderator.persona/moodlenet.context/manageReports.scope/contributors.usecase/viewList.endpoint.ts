/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type viewList = moo.persona.endpoint<[ZodVoid, void]>

export const viewList: moo.def.gate.provider.endpoint<viewList> = () => E.right({ zod: voidz() })
