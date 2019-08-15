import inv, { simple as simple_inv } from 'invertible'

export function sub(x, y, forwardFn, inverseFn) {
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
    const { input, output } = args
    const value = input[this.read_prop]

    // TODO: should the customFn always run, even on value === undefined? make it a config
    if (value !== undefined) {
        const result = this.customFn(value, { input: value, output })

        // TODO: if result is undefined, should it be ignored? stored as undefined? or should it be deleted? #config
        if (result !== undefined) {
            args.output[this.write_prop] = result
        }
    }
    return args
}
