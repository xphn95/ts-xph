interface Person {
  name: string
}

const f1 = (a: Person | Person[]): void => {
  if ('name' in a) {
    console.log(a) // Person
  } else {
    console.log(a) // Person[]
  }
}

f1({ name: 'mike' })

export {}
