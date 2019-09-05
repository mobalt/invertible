import simple_inv from './simple'
import inv from './inv'

export default function descend(x, y, forwardFn, inverseFn) {
    return simple_inv({
        context: {
            read_prop: [x, y],
            write_prop: [y, x],
            customFn: inv(forwardFn, inverseFn),
        },
        fn: __descend__,
    })
}

function __descend__(args) {
    const input = args.input[this.read_prop]

    if (input !== undefined) {
        const result = this.customFn({ input, output: {} }, args)

        if (result !== undefined && result.output !== undefined) {
            args.output[this.write_prop] = result.output
        }
    }
    return args
}
