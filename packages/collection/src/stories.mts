// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as CollectionContributorCardStories from './webapp/components/molecules/CollectionContributorCard/CollectionContributorCard.stories.js'
export * as CollectionCardStories from './webapp/components/organisms/CollectionCard/CollectionCard.stories.js'
export * as HeaderResourceStories from './webapp/components/organisms/Header/HeaderResource.stories.js'
// @endindex
