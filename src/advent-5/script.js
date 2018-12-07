const { chai, describe, it, mocha } = window
const assert = chai.assert
mocha.setup('bdd')

const breakDown = str => {
  let word = str.split('')
  for (let l = 0; l < word.length; l++) {
    if (
      word[l + 1] &&
      word[l].toUpperCase() === word[l + 1].toUpperCase() &&
      word[l] !== word[l + 1]
    ) {
      word.splice(l, 2)
      return breakDown(word.join(''))
    }
  }
  return word.join('')
}

describe('Advent 5 - Breaks it down', () => {
  it('Breaks down opposite polarity match', () => {
    assert.equal(breakDown('Aa'), '')
    assert.equal(breakDown('Aab'), 'b')
    assert.equal(breakDown('abBA'), '')
  })
  it('Does nothing when the polarity matches or no types match', () => {
    assert.equal(breakDown('abAB'), 'abAB')
    assert.equal(breakDown('aabAAB'), 'aabAAB')
  })
  it('Succesfully breaks down something complex', () => {
    assert.equal(breakDown('dabAcCaCBAcCcaDA'), 'dabCBAcaDA')
  })
})

mocha.run()
