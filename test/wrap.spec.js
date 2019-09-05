import 'chai/register-should'
import wrap from '../src/wrap'
import inv from '../src/inv'

describe('wrap.js', () => {
    it('can chain invertible functions', () => {
        const fn = wrap(
            inv(x => {
                x.output.a = 'a'
                return x
            }),
            inv(x => {
                x.output.b = 'b'
                return x
            }),
        )

        fn({}).should.deep.equal({ a: 'a', b: 'b' })
    })
})
