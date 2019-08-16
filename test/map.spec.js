import 'chai/register-should'
import seq from '../src/sequence'
import map from '../src/map'
import inv, { pipe } from 'invertible'
import convert_prop from '../src/properties'

describe('map.js', () => {
    it('can map one list onto another list', () => {
        const f = seq(map('list', 'LIST', inv(x => ({ output: x.input }))))

        f({ list: [{ x: 2 }, { y: 3 }] }).should.deep.equal({
            LIST: [{ x: 2 }, { y: 3 }],
        })
    })
    it('can apply multiple filters using pipe', () => {
        const f = seq(
            map(
                'old_list',
                'new_list',
                pipe(
                    convert_prop('x', 'y'),
                    convert_prop('y', 'zeta'),
                ),
            ),
        )

        f({ old_list: [{ x: 5 }, { y: 2 }] }).should.deep.equal({
            new_list: [{ y: 5 }, { zeta: 2 }],
        })
    })
})
