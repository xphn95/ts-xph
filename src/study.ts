interface Circle {
  kind: 'Circle'
  radius: number
}

interface Square {
  kind: 'Square'
  sideLength: number
}

type Shape = Circle | Square

const f1 = (a: Shape): number => {
  if (a.kind === 'Square') {
    return a.sideLength ** 2
  } else {
    return a.radius ** 2 * Math.PI
  }
}

console.log(f1({ kind: 'Circle', radius: 2 }))
export {}
