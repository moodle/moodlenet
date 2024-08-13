// @index(['../ui/**/*.stories.*'], f => `export * as ${f.name.replace('.stories','Stories').replace('.props','')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as LoginPropsStories from '../ui/Login/LoginProps.stories.mjs'
export * as SignupPropsStories from '../ui/Signup/SignupProps.stories.mjs'
// @endindex
