import { v4 as uuidv4 } from 'uuid'

export const newUuid: () => string = uuidv4
export const never = (more = '') => {
  throw new Error(`never ${more}`)
}
