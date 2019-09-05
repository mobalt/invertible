import inv from './inv'
import simple_inv from './simple'

/**
 * The result of a partial will merged into the output object.
 * This makes it so an output object does not need to be modified directly.
 * Also the input is passed as the first argument, to make it easier to use.
 * @param {function} forwardFn
 * @param {function} inverseFn
 * @returns {*}
 */
export default function partial(forwardFn, inverseFn) {
    // inv's passthrough function (set by passing false as inverseFn)
    // when used in a partial, contaminates the output object
    // with all of the properties of the raw input object
    // so we're overriding that behavior by having inverseFn return nothing
    if (inverseFn === false) inverseFn = () => undefined

    return simple_inv({
        context: { customFn: inv(forwardFn, inverseFn) },
        fn: __partial__,
    })
}

function __partial__(args) {
    const partial_result = this.customFn(args.input, args)
    merge_objects(args.output, partial_result)
    return args
}

/**
 * Merge properties of transferor object into recipient object
 * @param {object} recipient
 * @param {object} transferor
 * @returns {object}
 */
function merge_objects(recipient, transferor) {
    if (typeof transferor == 'object') {
        for (let prop in transferor) {
            const value = transferor[prop]
            if (value === undefined) {
                delete recipient[prop]
            } else {
                recipient[prop] = value
            }
        }
    }
    return recipient
}
