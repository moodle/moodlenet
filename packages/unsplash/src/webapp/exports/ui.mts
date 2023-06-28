// @index(['../ui/**/!(*.stories|*Hooks|*Hook|*Container|*Context|*Route)*.{mts,tsx}'], f => `export * from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * from '../ui/Unsplash.js'
// @endindex
