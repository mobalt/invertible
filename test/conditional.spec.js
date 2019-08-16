import 'chai/register-should'
import seq from '../src/sequence'
import sub from '../src/descend'
import conditional from '../src/conditional'
import inv from 'invertible'
import convert_prop from '../src/properties'

describe('conditional.js', () => {
    const f = seq(
        convert_prop('n', 'n'),
        conditional(
            inv(({ n }) => n % 2),
            sub('n', 'odd', () => true),
            sub('n', 'even', () => true),
        ),
    )

    it('do thenFn when true', () => {
        f({ n: 9 }).should.deep.equal({ n: 9, odd: true })
    })
    it('do elseFn when false', () => {
        f({ n: 4 }).should.deep.equal({ n: 4, even: true })
    })
    it.skip('reverse', () => {
        // TODO
        f.inv({ n: 4, even: true }).should.deep.equal({ n: 4 })
        f.inv({ n: 4, odd: true }).should.deep.equal({ n: 4 })
    })
})
