// @index(['**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as HeaderStories from './components/organisms/Header/Header.stories.js'
export * as ProfileCardStories from './components/organisms/ProfileCard/ProfileCard.stories.js'
export * as UsersStories from './components/organisms/Roles/Users.stories.js'
// @endindex
