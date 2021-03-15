export const rndImg = (w: number, h: number) =>
  `https://picsum.photos/seed/${Math.round(Math.random() * 10e8 + 10e3).toString(36)}/${w}/${h}`
