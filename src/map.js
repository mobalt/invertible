import { simple as simple_inv } from 'invertible'

export default function map(x, y, customFn) {
    return simple_inv({
        context: {
            read_prop: [x, y],
            write_prop: [y, x],
            customFn,
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

    // TODO: #config
    if (Array.isArray(inputArray)) {
        const outputArray = []
        for (const input of inputArray) {
            const newArgs = { input, output: {} }
            const raw = this.customFn(newArgs)

            // TODO: #config
            // also, what if saving an empty object is the desired behavior?
            if (raw && !isEmpty(raw.output)) {
                outputArray.push(raw.output)
            }
        }

        // TODO: #config
        if (outputArray.length) {
            args.output[this.write_prop] = outputArray
        }
    }
    return args
}
