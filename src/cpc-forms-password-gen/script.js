const symbolsSet = ' !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('')
const lowerSet = 'abcdefghijklmnopqrstuvwxyz'.split('')
const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const numbersSet = '0123456789'.split('')
const { Vue } = window

const getRandomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const generatePassword = (characters, length) => {
  let pass = []
  for (let c = 0; c < parseInt(length, 10); c++) {
    pass.push(characters[getRandomInRange(0, characters.length - 1)])
  }
  return pass.join('')
}

const getCharacters = ({ lower, numbers, symbols, upper }) => {
  let characters = []
  if (symbols) characters = characters.concat(symbolsSet)
  if (numbers) characters = characters.concat(numbersSet)
  if (lower) characters = characters.concat(lowerSet)
  if (upper) characters = characters.concat(upperSet)
  return characters
}

const getPasswordStrength = password => {
  let strength = 0
  const lengthTest = new RegExp(/^(?=.{16,})/)
  const upperTest = new RegExp(/^(?=.*[A-Z])/)
  const numbersTest = new RegExp(/^(?=.*[0-9])/)
  const symbolTest = new RegExp(/^(?=.*[ !"#$%&\\'()*+,-./:;<=>?@[\]^_`{|}~])/)
  if (lengthTest.test(password)) strength += 1
  if (upperTest.test(password)) strength += 1
  if (numbersTest.test(password)) strength += 1
  if (symbolTest.test(password)) strength += 1
  switch (strength) {
    case 1:
      strength = '👎'
      break
    case 2:
      strength = '😐'
      break
    case 3:
      strength = '😄'
      break
    case 4:
      strength = '💪'
      break
  }
  return strength
}
const defaultOptions = {
  lower: true,
  numbers: true,
  symbols: true,
  upper: false,
}
new Vue({
  el: '#app',
  data: {
    characters: getCharacters(defaultOptions),
    passLength: 32,
    password: undefined,
    potential: {
      password: undefined,
      strength: undefined,
    },
    options: defaultOptions,
  },
  methods: {
    getNewPassword: function() {
      const password = generatePassword(this.characters, this.passLength)
      const strength = getPasswordStrength(password)
      this.potential = {
        password,
        strength,
      }
    },
    openModal: function() {
      this.getNewPassword()
      this.$refs.MODAL.showModal()
    },
    setPassword: function() {
      this.password = this.potential.password
      this.$refs.MODAL.close()
    },
  },
  watch: {
    passLength: {
      handler: function() {
        this.getNewPassword()
      },
    },
    options: {
      handler: function() {
        this.characters = getCharacters(this.options)
        this.getNewPassword()
      },
      deep: true,
    },
  },
})
