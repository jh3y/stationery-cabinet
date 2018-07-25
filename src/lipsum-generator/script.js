const { faker, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

class App extends Component {
  state = {
    lipsum: '',
    rows: 6,
    sentenceCount: Math.floor(Math.random() * 10) + 3,
  }
  onCopy = () => {
    var t = document.createElement('textarea')
    t.value = this.state.lipsum
    document.body.appendChild(t)
    t.select()
    document.execCommand('Copy')
    t.remove()
    this.setState(
      {
        copied: true,
      },
      () => this.INPUT.focus()
    )
  }
  onWipe = () => {
    this.setState(
      {
        copied: false,
        lipsum: '',
        rows: 6,
        sentenceCount: Math.floor(Math.random() * 10) + 3,
      },
      () => this.INPUT.focus()
    )
  }
  onKeyPress = e => {
    const { key, target, which } = e
    const { sentenceCount: oldSentenceCount } = this.state
    let lipsum
    const suffix = oldSentenceCount === 0 ? '.' : ''
    if (target.value === '') {
      const newWord = faker.lorem.word()
      lipsum = `${newWord.charAt(0).toUpperCase()}${newWord.slice(1)}`
    } else if (which === 13) {
      lipsum = `${target.value}${
        this.state.which !== 13 &&
        this.state.key !== '.' &&
        target.value.charAt(target.value.length - 1) !== '.' &&
        target.value.charAt(target.value.length - 1) !== '!'
          ? '.'
          : ''
      }\n`
    } else if (key.match(/[a-zA-Z]/) && which !== 13 && oldSentenceCount < 0) {
      const newWord = faker.lorem.word()
      lipsum = `${target.value} ${newWord
        .charAt(0)
        .toUpperCase()}${newWord.slice(1)}`
    } else if (key.match(/[a-zA-Z]/) && which !== 13) {
      const newWord = faker.lorem.word()
      lipsum =
        this.state.which === 13
          ? `${target.value}${newWord.charAt(0).toUpperCase()}${newWord.slice(
              1
            )}`
          : `${target.value} ${newWord}${suffix}`
    }
    let sentenceCount
    if (which !== 13 && this.state.which !== 13)
      sentenceCount = oldSentenceCount - 1
    if (oldSentenceCount < 0 || (which === 13 || this.state.which === 13))
      sentenceCount = Math.floor(Math.random() * 10) + 3

    this.setState({
      copied: false,
      lipsum,
      key,
      which,
      sentenceCount,
      rows: Math.floor(e.target.scrollHeight / 24) - 1,
    })
  }
  render = () => {
    const { onCopy, onKeyPress, onWipe } = this
    const { copied, lipsum, rows } = this.state

    return (
      <Fragment>
        <h1>Type to lipsum</h1>
        <div className="textarea-wrap">
          <button onClick={onWipe}>
            <svg preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </button>
          <textarea
            rows={rows}
            spellCheck={false}
            ref={i => (this.INPUT = i)}
            onKeyPress={onKeyPress}
            value={lipsum}
            placeholder="Start typing..."
          />
        </div>
        <button className="action" onClick={onCopy}>
          {copied ? 'Copied 👍' : 'Copy'}
        </button>
      </Fragment>
    )
  }
}
render(<App />, rootNode)
