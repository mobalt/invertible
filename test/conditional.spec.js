import 'chai/register-should'
import wrap from '../src/wrap'
import dive from '../src/dive'
import conditional from '../src/conditional'
import inv from '../src/inv'
import convert_prop from '../src/properties'

describe('conditional.js', () => {
    const f = wrap(
        convert_prop('n', 'n'),
        conditional(
            inv(({ n }) => n % 2),
            dive('n', 'odd', () => true),
            dive('n', 'even', () => true),
        ),
    )

    it('do thenFn when true', () => {
        f({ n: 9 }).should.deep.equal({ n: 9, odd: true })
    })
    it('do elseFn when false', () => {
        f({ n: 4 }).should.deep.equal({ n: 4, even: true })
    })
    it('reverse', () => {
        f.inv({ n: 9, even: true }).should.deep.equal({ n: 9 })
        f.inv({ n: 4, even: true }).should.deep.equal({ n: 4 })
        f.inv({ n: 4, odd: true }).should.deep.equal({ n: 4 })
    })
})
