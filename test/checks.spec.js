import 'chai/register-should'
import inv from '../src/main'
import isInvertibleFn, { requireInvertibleFns } from '../src/checks'

const normal = x => x
const invertible = inv(x => x)
const invertible2 = inv(x => -x)

describe('#isInvertibleFn', () => {
    it('can find valid invertible functions', () => {
        isInvertibleFn(invertible).should.equal(true)
    })
    it('can find non-invertibles', () => {
        isInvertibleFn(normal).should.equal(false)
    })
})

describe('#requireInvertibleFns', () => {
    it('returns true when all arguments are invertible functions', () => {
        requireInvertibleFns(invertible).should.equal(true)
        requireInvertibleFns(invertible, invertible2).should.equal(true)
    })
    it('throws error when it encounters a non-invertible', () => {
        should.Throw(
            () => requireInvertibleFns(invertible, normal),
            TypeError,
            /The function ".+" is not invertible./,
        )
    })
})
