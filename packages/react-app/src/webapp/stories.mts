// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as SimpleLayoutStories from './ui/components/layout/SimpleLayout/SimpleLayout.stories.js'
export * as LoginStories from './ui/components/pages/Access/Login/Login.stories.js'
export * as SignupStories from './ui/components/pages/Access/Signup/Signup.stories.js'
// @endindex
