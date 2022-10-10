export const elementFullyInViewPort = (el, options) => {
  let { left, top, right, bottom } = el.getBoundingClientRect()
  const height = bottom - top
  const width = right - left
  if (options?.marginTop) {
    top = top - options.marginTop
  }
  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  )
}
export const getRandomInt = max => Math.floor(Math.random() * max)
export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export const fileExceedsMaxUploadSize = (size, max) => (max === null ? false : size > max)
//# sourceMappingURL=utilities.js.map
