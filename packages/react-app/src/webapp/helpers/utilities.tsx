export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  },
): boolean => {
  const { left, right, bottom } = el.getBoundingClientRect()
  let { top } = el.getBoundingClientRect()

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

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max)
