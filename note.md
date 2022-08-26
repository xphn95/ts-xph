## 类型擦除

### 快(不检查TS语法)
`npm i -g esbuild` -> `esbuild 1.ts > 1.js`

`npm i -g @swc/cli @swc/core` -> `swc 1.ts -o 1.js`

### 慢(检查TS语法, 即便不检查也慢得多)
`npm i -g typescript` -> `tsc 1.ts`

`pnpm i @babel/core @babel/cli @babel/preset-typescript` -> `babel --presets @babel/preset-typescript 1.ts`

## 运行TS

> TypeScript --(运行)--> Deno<br>
> |(类型擦除)<br>
> ES6 ----> Node.js 12+, Chrome 100(截至目前仍未完全兼容)<br>
> |(转译)<br>
> ES5 ----> Node.js 10-, IE 11-<br>
> |(打包)<br>
> 单文件 --(下载)--> 浏览器

### 在线
- typescript playground
- playcode.io
- stackblitz.com
- codesandbox.io

### 本地
- ts-node
- swc-node
- esno

## 推荐书籍

`编程与类型系统`
`TypeScript编程`
`类型和程序设计语言`

## 数据类型有哪些

- JS
  - null, undefined
  - string, number, boolean
  - bigint, symbol
  - object(Array, Function, Date...)
- TS
  - 以上所有
  - void, never, enum, unknown, any
  - 自定义类型type, interface

#### 包装对象
js 自动完成
`(42).toFixed(2)`
```js
/* eslint-disable */
const temp = new Number(42)
/* eslint-enable */
value = temp.toFixed(2)
// 删除 temp
// 返回 value, 注意是字符串, toFixed() 返回的是字符串
```

`JS 中的 Number, String, Boolean 只用于包装对象, 一般开发并不会用, TS 中也不用`

```typescript
type Object = {} | Array | Function | String | Number | Boolean | RegExp | ...
```

`Object 表示的范围太大了`

## 用类型签名和 Record 描述对象

### 如何在 TS 里<font color="orange">描述对象</font>的数据类型?
1. 用 <font color="orange">class/constructor</font> 描述
   1. Object: 数组对象Array, 函数对象Function, 正则对象RegExp, 日期对象Date
   2. ```typescript
      const a: Function = () => console.log(1)
      ```
2. 用 <font color="orange">type</font> 或 <font color="orange">interface</font> 描述
   1. ```typescript
      /* type Person = {
        name: string,
        age: number
      }

      const a: Person = {
        name: 'mike',
        age: 20
      } */

      // 索引签名的类型范围必须是 string | number | symbol
      type A = {
        [k: string]: number
        // [k: undefined]: number
      }

      // A2 与 A 是等价的
      type A2 = Record<string, number>

      const a: A = {
        aaa: 3242,
        3213: 890809
      }
      ```

## 用 [] 和 Array 泛型描述数组

```typescript
type A = string[]
const a: A = ['aa', 'bb', 'cc']

type B = Array<number>
const b: B = [123, 4435, 89, 5645]

type C = Array<string|number>
const c: C = ['dd', 453]
```

## 描述函数对象

不罗嗦了, 参数的检查是稀松的不能多可以少

以下是带 this 的情况(无法使用箭头函数)
```typescript
type Person = {
  name: string,
  age: number,
  sayHi: FnWithThis
}

type FnWithThis = (this: Person, name: string) => void

const sayHi: FnWithThis = function () {
  console.log('hi', this.name)
}

const p: Person = {
  name: 'john',
  age: 20,
  sayHi
}

p.sayHi('mike')
sayHi.call(p, 'mike')
```

由于 Function 太不精确, 所以一般用 () => ? 来描述函数

## 描述其他对象

```typescript
const d: Date = new Date()

const r: RegExp = /ab+c/

const m: Map<string, number> = new Map()

m.set('123', 2312)

const wm: WeakMap<{ name: string }, number> = new WeakMap()

// object 是 js 中的引用类型, 注意和 Object 区分
type A = object
const a: A = {}

const s: Set<number | string> = new Set()
s.add('hi')
s.add(123)

const ws: WeakSet<{ name: string }> = new WeakSet()
ws.add({ name: 'mike' })
```

## any 和 unknown 的区别

### any
所有类型的并集

### unknown
一开始不知道什么类型, 多用在外部获取的数据, 可以再断言真正的类型

## never 类型怎么用
表示空集

## 何时用 enum

1. 简单的映射

``` typescript
enum A {
  todo = 0,
  done,
  archived,
  deleted
}

let status_: A = 0
status_ = A.todo
status_ = A.done

console.log(status_) // 1
```

2. 权限控制配合位运算

```typescript
// 权限

enum Permission {
  None = 0, // 0000
  Read = 1 << 0, // 0001
  Write = 1 << 1, // 0010
  Delete = 1 << 2, //0100
  Manage = Read | Write | Delete // 0111
}

type User = {
  permission: Permission
}

const user: User = {
  permission: 0b0101
}

// 如果 a & b === b , 那么 a 拥有 b 的所有
if ((user.permission & Permission.Write) === Permission.Write) {
  console.log('拥有写权限')
} else {
  console.log('没有写权限')
}

if ((user.permission & Permission.Manage) === Permission.Manage) {
  console.log('拥有管理权限')
} else {
  console.log('没有管理权限')
}
```

## 何时使用 enum 会显得很呆?

```typescript
// bad
enum Fruit {
  apple = 'apple',
  banana = 'banana',
  pineapple = 'pineapple',
  watermelon = 'watermelon'
}

let f: Fruit = Fruit.apple

f = Fruit.watermelon

// good
type Fruit_ = 'apple' | 'banana' | 'pineapple' | 'watermelon'

let f_: Fruit_ = 'apple'
f_ = 'watermelon'

console.log(f === f_)
```

### 结论

- number enum (√)
- string enum (√可以, ×但可以自定义类型代替)
- other enum (×)

## type 和 interface 的前两个区别

### type

#### 类型别名, 给其它类型取个名字, type 几乎万能

```typescript
type Name = string

type FalseLike = 0 | '' | null | undefined | false

// 这个使用场景 react
type FnWithProp = {
  (a: number, b: number): void
  prop: string
}

const f: FnWithProp = (x, y) => {
  return x + y
}

f.prop = 'hello'
```

#### type 为什么叫类型别名, 不叫类型声明

```typescript
type A = string
type B = A // ts 的设定 type 并不想被记住, type B = string
```

### 何时使用 interface

声明接口, 描述对象的属性, 以面向对象的形式描述和 type 差不多的类型

```typescript
type A1 = Array<string> & {
  name: string
} & X

interface X {
  age: number
}

interface A2 extends Array<string>, X {
  name: string
}
```

```typescript
interface Fn {
  (a: number, b: number): number
  xxx: number
}

const f: Fn = (x, y) => {
  return x + y
}
f.xxx = 123

interface D extends Date {}

const d: D = new Date()
```

区别:
1. interface 只<font color="orange">描述对象</font>, type 则描述所有数据
2. type 只是<font color="orange">别名</font>, interface 则是类型声明

## type 与 interface 的第三个区别

type 不可再更改, 重复声明的 interface 会自动合并做到扩展的效果

```typescript
declare global {
  interface String {
    padZero: (x: string) => void
  }
}

const s = 'hello'
s.padZero('')

export {}
```

对外 API 尽量用 interface 方便扩展
对内 API 尽量用 type 防止代码分散(因为 type 不可再更改)

说 type 不能继承是不对的, 继承就是扩展, type 是可以扩展的, 所以不是不使用 extends 关键字的就不是继承

## void

可以有返回值, 但是使用返回值时会检查的

```typescript
type Fn = () => void
const f: Fn = () => {
  return 'xxx'
}

const a = f()
console.log(a.toString()) // 报错, 是没有这个方法的

// 这种情况会严格检查的
const f_ = function (): void {
  return 2  // number 不能分配给 void
}
```

## 联合类型(并集)

并集绝对是范围变大, 并不是认为的要求更多范围更小
```typescript
interface A {
  name: string
}

interface B {
  age: number
}

type C = A | B
const c: C = {
  name: 'mike', // 只写一个属性是可以的
  age: 10
}

console.log(c)
export {}
```

使用的时候要搭配类型收窄, 不然只能使用原本子集共有的方法

```typescript
type A = string
type B = number

const f = (n: A | B): string | boolean => {
  if (typeof n === 'number') {
    return n.toFixed(2)
  } else {
    return n.includes('a')
  }
}
f(2)

export {}
```

## 使用 JS 做类型收窄


### typeof
`typeof x`

`string`, `number`, `bigint`, `boolean`, `symbol`, `undefined`, `object`, `function`

可以看到 `typeof` 能判断的所有结果
```typescript
let x: any
const y = typeof x
console.log(typeof x, y)

export {}
```

### instanceof
`typeof` 无法准确细分对象类型, `instanceof` 可以来弥补这点

局限:
- 不支持基本类型
- 不支持 TS 独有的类型

### in

通过特殊的 key 来判断, 但是只适用于部分对象

```typescript
interface Person {
  name: string
}

const f1 = (a: Person | Person[]): void => {
  if ('name' in a) {
    console.log(a) // a: Person
  } else {
    console.log(a) // a: Person[]
  }
}

f1({ name: 'mike' })

export {}
```

## 类型谓词 is

```typescript
interface Rect {
  height: number
  width: number
}

interface Circle {
  center: [number, number]
  radius: number
}

const f1 = (a: Rect | Circle): number => {
  if (isRect(a)) {
    return a.height * a.width
  } else {
    return a.radius ** 2 * Math.PI
  }
}

// 返回值的类型使用 is 可以帮助 TS 理解 true/false 代表什么
// function isRect (x: Rect | Circle): boolean {
function isRect (x: Rect | Circle): x is Rect {
  return 'height' in x && 'width' in x
}

// const res = f1({ width: 2, height: 3 })
const res = f1({ center: [1, 1], radius: 2 })
console.log(res)
export {}
```

## 可辨别联合类型 x.kind

```typescript
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
```

### 优点:
让<font color="orange">复杂类型</font>的<font color="deepskyblue">收窄</font>变成<font color="orange">简单类型</font>的<font color="deepskyblue">对比</font>

### 要求:
T = A | B | C | D |...
1. <font color="orange">有相同属性</font> kind 或其它
2. kind 的类型是<font color="orange">简单类型</font>
3. 各类型中的 <font color="orange">kind 可区分</font>
则称 T 为可辨别联合

### 一句话总结
同名, 可辩别的简单类型的 key

## 重新看待 any 和 unknown
any 不是除了 never/unknown/any/void 的所有类型的联合, unknown 是

any 类型什么方法都可以调用, 而联合在不收窄的情况下只能用些子类型共有方法, 刚好符合 unknown, unknown 可以收窄到任何类型

## 交叉类型(交集)
### 小心属性冲突时 type 交集会产生 never , 想扩展用 interface 的 extends 最好

```typescript
interface A {
  id: string
  email: string
}

interface B {
  id: number
  name: string
}

type C = B & A

const c: C = {
  id: 1, // 这里 id 类型是 never
  name: 'mike',
  email: 'xxx'
}

console.log(c)
export {}
```

### 冲突的是属性为函数的入参时, 会将入参的类型取并集(联合类型)

```typescript
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
```
