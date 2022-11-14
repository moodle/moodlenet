// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as HeaderStories from './webapp/components/organisms/Header/Header.stories.js'
export * as ProfileCardStories from './webapp/components/organisms/ProfileCard/ProfileCard.stories.js'
// @endindex
