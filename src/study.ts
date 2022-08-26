interface A {
  methods: (n: number) => void
}

interface B {
  methods: (n: string) => void
}
type C = A & B

const c: C = {
  methods: (n) => { // n 的类型是 number | string
    console.log(n)
  }
}

console.log(c)
export {}
