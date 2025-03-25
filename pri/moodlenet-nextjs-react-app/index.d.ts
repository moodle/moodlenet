declare module '*.svg' {
  type url_string = import('@moodle/lib-types').url_string
  type SvgIntrinsicElement = import('react').JSX.IntrinsicElements.svg
  const content: url_string
  export const ReactComponent: SvgIntrinsicElement & { src: url_string }
  export default content
}
