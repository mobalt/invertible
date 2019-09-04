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
### inv(forwardFn, inverseFn)
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

### check(function)
Checks if the function is a proper invertible function.

### simple({context:{}, fn: function})
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

### pipe(...invertibleFunctions)
An invertible pipe allows multiple invertible functions to be chained together and run sequentially with a single function call. The inverse pipe (`.inv`) runs the inverse functions, in reverse order, ie [LIFO](https://en.wikipedia.org/wiki/LIFO_(computing)).

```node
const iPipe = inv.pipe(
                    inv(x => x * 3, y => y / 3),
                    inv(x => x + 1, y => y - 1),
                    inv(x => x * 2, y => y / 2),
                    inv(x => x + 5, y => y - 5),
                )
// notice the inverse of (x * 3 + 1) * 2 + 5
//         is not        (x / 3 - 1) / 2 - 5
//         rather it is  ((x - 5) / 2 - 1) / 3
//          so:
iPipe(1) === 13
iPipe.inv(13) === 1   // since LIFO, not 3.333 (LILO)
```



## Development

| Command     | Task                          |
| ----------- | ----------------------------- |
| `yarn lint` | Fix code style errors.        |
| `yarn test` | Run the unit tests via Mocha. |
