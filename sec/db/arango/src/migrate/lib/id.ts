import { ComputedValueOptions } from 'arangojs/collection'

export function removePropOnInsert(prop: string): ComputedValueOptions {
  return {
    name: prop,
    expression: 'RETURN null',
    computeOn: ['insert'],
    keepNull: false,
    overwrite: true,
  }
}
