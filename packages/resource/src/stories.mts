// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ContributorCardStories from './webapp/components/molecules/ContributorCard/ContributorCard.stories.js'
export * as HeaderStories from './webapp/components/organisms/Header/HeaderResource.stories.js'
// @endindex
