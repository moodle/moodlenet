// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as MainLayoutStories from './ui/components/layout/MainLayout/MainLayout.stories.js'
// @endindex
