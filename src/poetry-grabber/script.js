const { createContext, Component, Fragment } = React
const { render } = ReactDOM

class App extends Component {
  state = {
    loading: true,
    poem: undefined,
  }
  static defaultProps = {
    stars: [],
  }

  componentDidMount() {
    this.getPoem()
  }

  getPoem = async () => {
    this.setState(
      {
        error: false,
        poem: null,
        loading: true,
      },
      async () => {
        try {
          const poem = await this.getRandomPoem()
          this.setState({
            error: false,
            loading: false,
            poem: Object.assign({}, poem, {
              lines: [...poem.lines, ...['', poem.author]],
            }),
          })
        } catch (e) {
          this.setState({
            error: true,
            loading: false,
          })
        }
      }
    )
  }

  async getRandomPoem() {
    const prefixUrl = 'https://crossorigin.me/http://poetrydb.org'
    // ⚠️ Triple await usage ahead 😵
    // grab a poet
    const authors = await (await (await fetch(`${prefixUrl}/author`)).json())
      .authors
    const author = authors[Math.floor(Math.random() * authors.length)]
    // get a random poem title for that poet
    const poems = await (await fetch(
      `${prefixUrl}/author/${author}/title`
    )).json()
    const chosenPoem = poems[Math.floor(Math.random() * poems.length)]
    // grab the poet with some more pretty triple await
    const poem = await (await (await fetch(
      `${prefixUrl}/title/${chosenPoem.title}/title,author,lines`
    )).json())[0]
    return poem
  }
  componentDidUpdate = (previousProps, previousState) => {
    const { composer, state } = this
    const { poem } = state
    // if (false) {
    if (poem && !previousState.poem) {
      const subject = composer.querySelector('.composer__subject')
      const content = composer.querySelector('.composer__content')
      const lines = content.querySelectorAll('.composer__line')
      const setHeight = lines[0].getBoundingClientRect().height
      const generateLine = (text, el, delay = 0) => {
        const tl = new TimelineMax({
          onComplete: () => {
            content.scrollTop = content.scrollHeight
            if (el.nextElementSibling) {
              el.nextElementSibling.setAttribute(
                'style',
                `min-height: ${setHeight}px`
              )
            }
          },
          delay,
        })
        for (let l = 1; l < text.length + 1; l++) {
          tl.add(
            TweenMax.to(el, 0.04, {
              text: text.slice(0, l),
              onComplete: () => {
                content.scrollTop = content.scrollHeight
              },
            })
          )
        }
        return tl
      }
      const wipe = el =>
        TweenMax.to(el, 0, {
          color: 'black',
          text: '',
          delay: Math.random(),
        })
      const generateLinesTl = () => {
        const linesTl = new TimelineMax()
        for (let l = 1; l < poem.lines.length; l++) {
          if (poem.lines[l].trim() === '') {
            linesTl.add(() =>
              TweenMax.to(lines[l], 0, { delay: Math.random() })
            )
          } else {
            linesTl.add(generateLine(poem.lines[l], lines[l], Math.random()))
          }
        }
        return linesTl
      }
      const poemTl = new TimelineMax()
      poemTl
        .add(
          generateLine(poem.title, subject, Math.random() + 0.25, 'Subject:')
        )
        .add(wipe(lines[0]))
        .add(generateLine(poem.lines[0], lines[0], Math.random() + 0.25))
        .add(generateLinesTl())
    }
  }
  send = () => {
    const { poem, recipient } = this.state
    const body = poem.lines.join('%0D%0A')
    const anchor = document.querySelector('.mail-link')
    anchor.href = `mailto:${recipient}?subject=${poem.title}&body=${body}`
    anchor.click()
  }
  updateRecipient = e => {
    this.setState({
      recipient: e.target.value,
    })
  }
  render = () => {
    const { getPoem, state, send, updateRecipient } = this
    const { error, loading, poem } = state
    return (
      <Fragment>
        <a target="_blank" className="mail-link">
          {' '}
          Send
        </a>
        {loading && <h2 className="loading__msg">Contacting PoetryDB... 📞</h2>}
        {error && (
          <div className="error">
            <h1 className="error__msg">
              Owww, looks like something went wrong 😭
            </h1>
            <button className="error__btn" onClick={getPoem}>
              Try again
            </button>
          </div>
        )}
        {poem && (
          <div className={'composer'} ref={c => (this.composer = c)}>
            <header className={'composer__header'}>
              <h1 className={'composer__label'}>To:</h1>
              <input
                type="text"
                className={'composer__to'}
                onInput={updateRecipient}
                placeholder={'Enter recipient email'}
              />
              <h1 className={'composer__label'}>Subject:</h1>
              <h1 className={'composer__subject'} />
            </header>
            <article className={'composer__content'}>
              {poem.lines.map((line, idx) => (
                <p className={'composer__line'} key={`poem-line--${idx}`}>
                  {idx === 0 && 'Compose your message'}
                </p>
              ))}
            </article>
            <footer className={'composer__actions'}>
              <button className={'composer__send'} onClick={send}>
                Send
              </button>
            </footer>
          </div>
        )}
        {poem &&
          poem.lines.length > 20 && (
            <div className="length-warning">
              <h2 className="length-warning__msg">
                ⚠️ This poem could be pretty long, you might be waiting a
                while...
              </h2>
              <button className={'length-warning__btn'} onClick={getPoem}>
                Get another one
              </button>
            </div>
          )}
      </Fragment>
    )
  }
} // Render the app 😎
render(<App />, root)
