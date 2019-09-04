# Invertible

A library to develop functions and their inverse simultaneously.

## Features

- Link forward/inverse functions
- Create a chain of invertible functions
- Easily transform objects between two schemas

## Installing

Using yarn:

```bash
$ yarn add mobalt/invertible
```

## Usage
Invertible functions act just like normal functions with the added benefit of their inverse readily available as an immutable property, `.inv`.

```node
import inv from 'invertible'

// normally a developer has to keep relationships in brainspace
const double = (x) => x * 2
const halve  = (x) => x * 2
double(9) === 18
halve(100) === 50

// but by linking the two functions, 
//  now the relationship is more obvious and convenient
const fn = inv(double, halve)
fn(9) === 18
fn.inv(100) === 50

// the `.inv` function also has an `.inv` reference back
fn.inv.inv(100) === fn(100)
```

### inv.simple({context:{}, fn: function})
Sometimes a function doesn't have complex inverse logic. However, even though forward and inverse functions can use the same logic, they require different internal constants or contexts. These functions benefit from using the `simple` factory.

```node
const foo = inv.simple({
    context: {
        from: ['x', 'y'],
        to: ['y', 'x'],
        addend: [7, -7],
        multiplicand: [2, 0.5],
    },
    fn: function (raw_input) {
        const inputValue = raw_input[this.from]
        const resultValue = (inputValue + this.addend) * this.multiplicand

        const result = {}
        result[this.to] = resultValue
        return result
    },
})
const bar = foo.inv

foo( {x:3} ) // ==> {y: 20}
bar( {y:20} ) // ==> {x: 3}
bar.inv.inv( {y:20} ) // ==> {x: 3}, same as bar or foo.inv
bar.inv( {x:3} ) // ==> {y: 20}   , same as foo
```



## Development

| Command     | Task                          |
| ----------- | ----------------------------- |
| `yarn lint` | Fix code style errors.        |
| `yarn test` | Run the unit tests via Mocha. |
