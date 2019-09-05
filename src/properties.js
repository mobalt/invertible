import simple_inv from './simple'

/**
 *
 * @param {string} x
 * @param {string} y
 * @returns {{}}
 */
export default function convert_prop(x, y) {
    return simple_inv({
        context: { read_prop: [x, y], write_prop: [y, x] },
        fn: __internal_property_conversion_fn__,
    })
}

function __internal_property_conversion_fn__(args) {
    const { input, output } = args
    const value = input[this.read_prop]

    if (value === undefined)
        // edge-case: delete property created by a previous rule
        delete output[this.write_prop]
    else output[this.write_prop] = value

    return args
}
