const { createContext, Component, Fragment } = React

const { render } = ReactDOM

const keyframes = styled.keyframes
const styled = styled.default

const prefixUrl = 'https://crossorigin.me/http://poetrydb.org'

const Poem = styled.div``
const PoemTitle = styled.h2``
const ErrorContainer = styled.div``
const ErrorMsg = styled.h2``
const TryAgain = styled.button``
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
    this.setState({
      error: false,
      loading: true,
    }, async () => {
      try {
        const poem = await this.getRandomPoem()
        this.setState({
          error: false,
          loading: false,
          poem,
        })
      } catch (e) {
        this.setState({
          error: true,
          loading: false,
        })
      }
    })
  }

  async getRandomPoem() {
    // ⚠️ Triple await usage ahead 😭 😵
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
  render = () => {
    const { getPoem, state } = this
    const { error, loading, poem } = state
    console.info(loading, error, poem)
    return (
      <Fragment>
        {loading && <h2>Currently talking to the poets...</h2>}
        {error && (
          <ErrorContainer>
            <ErrorMsg>Oops, look like something went wrong, please try again</ErrorMsg>
            <TryAgain onClick={getPoem}>Try again</TryAgain>
          </ErrorContainer>
        )}
        {poem && (
          <Poem>
            <PoemTitle>{poem.title}</PoemTitle>
          </Poem>
        )}
      </Fragment>
    )
  }
}
// Render the app 😎
render(<App />, root)
