// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ResourceContributorCardStories from './webapp/components/molecules/ResourceContributorCard/ResourceContributorCard.stories.js'
export * as HeaderResourceStories from './webapp/components/organisms/Header/HeaderResource.stories.js'
// @endindex
