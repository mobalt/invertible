import inv from './inv'
import simple_inv from './simple'

/**
 * @param {function} forwardFn
 * @param {function} inverseFn
 * @returns {*}
 */
export default function simpleton(forwardFn, inverseFn) {
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

function __simpleton__(args) {
    args.output = this.customFn(args.input, args)
    return args
}
