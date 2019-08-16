import 'chai/register-should'
import partial from '../src/partial'
import convert_prop from '../src/properties'
import seq from '../src/sequence'

describe('partial.js', () => {
    const f = seq(
        convert_prop('x', 'original_x'),
        partial(input => {
            return {
                '2x': input.x * 2,
                'x^2': input.x * input.x,
            }
        }, false),
    )
    it('merges partial output objects with the full object', () => {
        f({ x: 4 }).should.deep.equal({
            original_x: 4,
            '2x': 8,
            'x^2': 16,
        })
    })
    it("if inverseFn set to false, then running in reverse doesn't do anything returns nothing", () => {
        f.inv({
            original_x: 4,
            '2x': 8,
            'x^2': 16,
        }).should.deep.equal({ x: 4 })
    })
})
