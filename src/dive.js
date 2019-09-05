import simple_inv from './simple'
import inv from './inv'

export default function dive(x, y, forwardFn, inverseFn) {
    return simple_inv({
        context: {
            read_prop: [x, y],
            write_prop: [y, x],
            customFn: inv(forwardFn, inverseFn),
        },
        fn: __dive__,
    })
}

function __dive__(args) {
    const input = args.input[this.read_prop]

    if (input !== undefined) {
        const result = this.customFn(input, { input, output: {} }, args)

        if (result === undefined) {
            delete args.output[this.write_prop]
        } else {
            args.output[this.write_prop] = result
        }
    }
    return args
}
