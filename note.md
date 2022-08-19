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

