declare module '*.svg' {
  const content: import('@moodle/lib-types').url_string
  export const ReactComponent: import('react').ComponentType
  export default content
}
