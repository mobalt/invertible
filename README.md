# Invertible

Create functions and their inverse in parallel.

## Usage
### default
To link two functions together use the default function.

```node
import inv from 'invertible'

const double = x => x * 2
const half = x => x / 2

// invertible function
const two = inv(double, half)

console.log(two(9))            // 18
console.log(two.inv(60))       // 30
console.log(two.inv.inv(60))   // 120
```

### simple
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
