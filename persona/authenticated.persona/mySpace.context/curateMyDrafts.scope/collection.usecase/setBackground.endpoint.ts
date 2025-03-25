/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { right } from 'fp-ts/Either'
import { object, string } from 'zod'

export type setBackground = moo.persona.endpoint<[typeof setBackgroundSchema, void]>

export const setBackground: moo.gate.provider.endpoint<setBackground> = (/* { configs, permissionsInfo } */) => {
  return right({
    zod: setBackgroundSchema(),
  })
}

export function setBackgroundSchema() {
  return object({
    id: string(),
  })
}
