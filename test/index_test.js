import build from '../src/build'

describe('build', () => {
  it('returns string', () => {
    expect(build(['root'], '')).toBe('root')
  })

  it('separates earch prefix by a space', () => {
    expect(build(['root', 'foo'], '')).toBe('root foo')
  })

  it('filters prefixes to be unique', () => {
    expect(build(['root', 'root'], '')).toBe('root')
    expect(build(['root', 'root'], 'foo')).toBe('root-foo')
  })

  describe('tail', () => {
    it('separates by two dashes', () => {
      expect(build(['root'], 'foo')).toBe('root-foo')
    })

    it('appends to each prefix', () => {
      const multiPrefix = build(['root', 'second'], 'foo')
      expect(multiPrefix).toEqual(expect.stringContaining('root-foo'))
      expect(multiPrefix).toEqual(expect.stringContaining('second-foo'))
    })
  })

  describe('state', () => {
    it('appends truthy state keys', () => {
      const withState = build(['root'], '', { 'is-loading': true })
      expect(withState).toEqual(expect.stringContaining('root-is-loading'))
      expect(withState).toEqual(expect.stringContaining('root'))
    })

    it('ignores falsey state keys', () => {
      const withState = build(['root'], '', { 'is-loading': false })
      expect(withState).not.toEqual(expect.stringContaining('root-is-loading'))
      expect(withState).toBe('root')
    })

    it('applies to each prefix', () => {
      const withState = build(['root', 'foo'], '', {
        'is-loading': true
      })
      const expected = ['root', 'root-is-loading', 'foo', 'foo-is-loading']
      expect(withState.split(' ')).toEqual(expect.arrayContaining(expected))
    })

    it('applies to each prefix with a tail', () => {
      const withState = build(['root', 'foo'], 'element', {
        'is-loading': true
      })
      const expected = ['root-element', 'root-element-is-loading', 'foo-element', 'foo-element-is-loading']
      expect(withState.split(' ')).toEqual(expect.arrayContaining(expected))
    })

    it('splits each prefix with space', () => {
      const withState = build(['root', 'foo bar'], '', {
        'is-loading': true
      })
      const expected = ['root', 'root-is-loading', 'foo', 'foo-is-loading', 'bar', 'bar-is-loading']
      expect(withState.split(' ')).toEqual(expect.arrayContaining(expected))
    })
  })
})
