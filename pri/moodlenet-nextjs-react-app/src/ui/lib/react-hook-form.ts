import { RegisterOptions } from 'react-hook-form'

export const blankToNullOption: Pick<RegisterOptions, 'setValueAs'> = {
  setValueAs(value) {
    return value === '' ? null : value
  },
}
