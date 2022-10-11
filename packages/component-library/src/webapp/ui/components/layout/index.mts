// @index(['./**/!(*.stories)*.{mts,tsx}'], f => `export * from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * from './MainLayout/MainLayout.js'
export * from './PageLayout.js'
export * from './SimpleLayout/SimpleLayout.js'
// @endindex
