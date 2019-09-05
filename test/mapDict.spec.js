import 'chai/register-should'
import mapDict from '../src/mapDict'
import wrap from '../src/wrap'

describe('mapDict.js', () => {
    const input = {
        from: [
            { group: '0', sub_group: '1', animal: 'dog', name: 'adam' },
            { group: '0', sub_group: '1', animal: 'cat', name: 'bob' },
            { group: '0', sub_group: '1', animal: 'cat', name: 'bob' },
            { group: '0', sub_group: '2', animal: 'cat', name: 'cow' },
            { group: '1', sub_group: '2', animal: 'dog', name: 'derick' },
        ],
    }
    const levels1 = ['group', 'sub_group']
    const out1 = {
        to: {
            '0': {
                '1': [
                    { animal: 'dog', name: 'adam' },
                    { animal: 'cat', name: 'bob' },
                    { animal: 'cat', name: 'bob' },
                ],
                '2': [{ animal: 'cat', name: 'cow' }],
            },
            '1': { '2': [{ animal: 'dog', name: 'derick' }] },
        },
    }
    const levels2 = ['animal']
    const out2 = {
        to: {
            cat: [
                { group: '0', name: 'bob', sub_group: '1' },
                { group: '0', name: 'bob', sub_group: '1' },
                { group: '0', name: 'cow', sub_group: '2' },
            ],
            dog: [
                { group: '0', name: 'adam', sub_group: '1' },
                { group: '1', name: 'derick', sub_group: '2' },
            ],
        },
    }

    it('turns an array into a hiearchy', () => {
        const f = wrap(mapDict('from', 'to', levels1))

        f(input).should.deep.equal(out1)
    })
    it('turns a hiearchical dict into an array', () => {
        const f = wrap(mapDict('from', 'to', levels1))

        f.inv(out1).should.deep.equal(input)
    })
    it('turns an array into a different hiearchy', () => {
        const f = wrap(mapDict('from', 'to', levels2))

        f(input).should.deep.equal(out2)
    })
    it('if levels=[], input array = output array', () => {
        const f = wrap(mapDict('from', 'to', []))

        const output = { to: input.from }
        f(input).should.deep.equal(output)
        f.inv(output).should.deep.equal(input)
    })
    it('if levels=[max], leafs will all be arrays with empty objects', () => {
        const f = wrap(
            mapDict('from', 'to', ['animal', 'name', 'group', 'sub_group']),
        )

        const output = {
            to: {
                cat: {
                    bob: { '0': { '1': [{}, {}] } },
                    cow: { '0': { '2': [{}] } },
                },
                dog: {
                    adam: { '0': { '1': [{}] } },
                    derick: { '1': { '2': [{}] } },
                },
            },
        }
        f(input).should.deep.equal(output)
        // f.inv(output).should.deep.equal(input)
    })
})
