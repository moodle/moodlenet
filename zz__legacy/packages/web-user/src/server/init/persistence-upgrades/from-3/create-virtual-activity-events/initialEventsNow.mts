import { shell } from '../../../../shell.mjs'

export const initialEventsNow = shell.now()
export const initialEventsNowISO = initialEventsNow.toISOString()
