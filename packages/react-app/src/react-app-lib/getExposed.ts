import exp from './exposedExtModules'
console.log('xxxxxxxx')

export function getExposed<K extends string>(k: K) {
  console.log({ exp, k })
  return exp[k]
}
