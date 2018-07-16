const { Component, Fragment } = window.React
const { render } = window.ReactDOM
const { default: styled } = window.styled
const rootNode = document.getElementById('app')

const symbolsSet = ' !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('')
const lowerSet = 'abcdefghijklmnopqrstuvwxyz'.split('')
const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const numbersSet = '0123456789'.split('')
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
      // strength = '👎'
      strength = '#f9690e'
      break
    case 2:
      // strength = '😐'
      strength = '#f9bf3b'
      break
    case 3:
      // strength = '😄'
      strength = '#66cc99'
      break
    case 4:
      // strength = '💪'
      strength = '#00e640'
      break
    default:
      strength = '#f22613'
  }
  return strength
}
const characters = getCharacters({
  lower: true,
  numbers: true,
  symbols: false,
  upper: false,
})
const Dialog = styled.dialog`
  background: ${p => getPasswordStrength(p.password)};
  border: 6px solid ${p => getPasswordStrength(p.password)};
`
const PotentialPassword = styled.h1`
  color: ${p => getPasswordStrength(p.password)};
`
const Action = styled.button`
  background: ${p => (p.isIcon ? 'transparent' : 'dodgerblue')};
  min-width: ${p => (p.isIcon ? '44px' : '120px')};
  transition: background 0.25s ease;

  &:hover {
    background: ${p => (p.isIcon ? 'transparent' : '#1e8bc3')};
  }

  &:active {
    background: ${p => (p.isIcon ? 'transparent' : '#3a539b')};
  }
`
class App extends Component {
  state = {
    password: '',
    potential: {
      password: undefined,
      strength: undefined,
    },
    options: {
      characters,
      lower: true,
      numbers: true,
      symbols: false,
      upper: false,
      length: 32,
    },
  }
  getNewPassword = cb => {
    const { characters, length } = this.state.options
    const password = generatePassword(characters, length)
    const strength = getPasswordStrength(password)
    const potential = {
      password,
      strength,
    }
    this.setState(
      {
        potential,
      },
      () => {
        if (typeof cb === 'function') cb()
      }
    )
  }
  setPassword = () => {
    this.setState(
      {
        password: this.state.potential.password,
      },
      () => {
        this.DIALOG.close()
      }
    )
  }
  onOptionChange = e => {
    const { options: oldOptions } = this.state
    const changedOption = {}
    changedOption[e.target.name] =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const options = Object.assign({}, oldOptions, changedOption)
    if (e.target.type === 'checkbox')
      options.characters = getCharacters(options)
    const password = generatePassword(options.characters, options.length)
    const strength = getPasswordStrength(password)
    this.setState({
      options,
      potential: {
        password,
        strength,
      },
    })
  }
  componentDidMount = () => {
    window.dialogPolyfill.registerDialog(this.DIALOG)
  }
  render = () => {
    const { getNewPassword, onOptionChange, setPassword, state } = this
    const { password, potential, options } = state
    return (
      <Fragment>
        <Dialog
          className="dialog"
          innerRef={d => (this.DIALOG = d)}
          password={potential.password}>
          <div className="dialog__content" password={potential.password}>
            <div className="potential">
              <PotentialPassword password={potential.password}>
                {potential.password}
              </PotentialPassword>
              {/*<PotentialStrength>{potential.strength}</PotentialStrength>*/}
            </div>
            <div className="options">
              <label style={{ gridColumn: '1 / 4' }}>Length</label>
              <label style={{ width: '30px' }}>{options.length}</label>
              <input
                type="range"
                min="8"
                max="100"
                name="length"
                onChange={onOptionChange}
                style={{ gridColumn: '1 / -1' }}
                value={options.length}
              />
              {[
                { label: 'A-Z', id: 'upper' },
                { label: 'a-z', id: 'lower' },
                { label: '0-9', id: 'numbers' },
                { label: '!"#$', id: 'symbols' },
              ].map((o, i) => (
                <Fragment key={`password-option--${i}`}>
                  <label htmlFor={o.id}>{o.label}</label>
                  <div className="check">
                    <input
                      id={o.id}
                      type="checkbox"
                      name={o.id}
                      onChange={onOptionChange}
                      checked={options[o.id]}
                    />
                    <span />
                    <span />
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="actions">
              <Action isIcon={true} onClick={getNewPassword}>
                <svg preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </Action>
              <Action onClick={setPassword}>Use</Action>
            </div>
          </div>
        </Dialog>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e =>
              this.setState({
                password: e.target.value,
              })
            }
          />
          <Action onClick={() => getNewPassword(() => this.DIALOG.showModal())}>
            Generate
          </Action>
        </div>
      </Fragment>
    )
  }
}
render(<App />, rootNode)
