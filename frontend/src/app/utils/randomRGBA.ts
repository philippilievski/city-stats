export function generateRandomRgba() {
  let o = Math.round, r = Math.random, s = 255;
  return `rgba(${o(r()*s)}, ${o(r()*s)}, ${o(r()*s)}, 1)`
}

export function generateRandomRgbaArray(length: number): string[] {
  const randomRgbaArray: string[] = [];

  for (let i = 0; i < length; i++) {
    randomRgbaArray.push(generateRandomRgba())
  }
  return randomRgbaArray;
}
