import { simple } from 'invertible'

export default function conditional(ifFn, thenFn, elseFn) {
    return simple({
        context: {
            ifFn,
            thenFn,
            elseFn,
        },
        fn: __if__,
    })
}

function __if__(args) {
    const condition = this.ifFn(args.input, args.output)

    if (condition) {
        //TODO: consider if thenFn/elseFn should use partials rather than full result objects, for example:
        // if (condition) return merge_objects(args.output, this.thenFn(input, args))
        // else if (this.elseFn) return merge_objects(args.output, this.elseFn(input, args))
        return this.thenFn(args)
    } else if (this.elseFn) {
        return this.elseFn(args)
    } else {
        return args
    }
}
