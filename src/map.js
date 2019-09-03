import { simple as simple_inv } from 'invertible'

export default function map(x, y, forwardFn, inverseFn) {
    return simple_inv({
        context: {
            read_prop: [x, y],
            write_prop: [y, x],
            customFn: inv(forwardFn, inverseFn),
        },
        fn: __map__,
    })
}
function isEmpty(obj) {
    if (typeof obj === 'object') for (const x in obj) return false
    return true
}
function __map__(args) {
    const inputArray = args.input[this.read_prop]

    if (Array.isArray(inputArray)) {
        const outputArray = []
        let index = 0
        for (const input of inputArray) {
            const newArgs = { input, output: {} }
            const result = this.customFn(
                newArgs,
                { input: inputArray, output: outputArray, index },
                args,
            )

            if (result && !isEmpty(result.output)) {
                outputArray.push(result.output)
            }
            index++
        }

        if (outputArray.length) {
            args.output[this.write_prop] = outputArray
        }
    }
    return args
}
