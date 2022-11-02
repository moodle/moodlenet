export const fileExceedsMaxUploadSize = (size: number, max: number | null) =>
  max === null ? false : size > max

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
