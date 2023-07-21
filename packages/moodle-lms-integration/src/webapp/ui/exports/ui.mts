// @index(['../!(exports)/**/!(*.stories)*.{mts,tsx}'], f => `export * from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * from '../components/SendToMoodle.js'
// @endindex
