// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as SimpleLayoutStories from './ui/components/layout/SimpleLayout/SimpleLayout.stories.js'
export * as AppearanceStories from './ui/components/pages/Settings/Appearance/Appearance.stories.js'
export * as GeneralStories from './ui/components/pages/Settings/General/General.stories.js'
// @endindex
