// @index(['../!(exports)/**/*.stories.*'], f => `export * as ${f.name.replace('.stories','Stories').replace('.props','')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as AccessButtonsStories from '../components/molecules/AccessButtons/AccessButtons.stories.props.js'
export * as AvatarMenuStories from '../components/molecules/AvatarMenu/AvatarMenu.stories.props.js'
export * as MinimalisticAccessButtonsStories from '../components/molecules/MinimalisticAccessButtons/MinimalisticAccessButtons.stories.props.js'
export * as AdvancedStories from '../components/pages/UserSettings/Advanced/Advanced.stories.props.js'
// @endindex
