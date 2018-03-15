const { createContext, Component } = React

const { render } = ReactDOM

const keyframes = styled.keyframes
const styled = styled.default

class App extends Component {
  state = {
    poem: undefined,
  }
  static defaultProps = {
    stars: [],
  }

  componentDidMount = () => {
    axios.get('https://crossorigin.me/http://poetrydb.org/author,title/Shakespeare;Sonnet')
      .then((poem) => this.setState({poem}))
  }

  render = () => {
    const {
      poem
    } = this.state
    console.info(poem)
    return (
      <h1>Hey there!</h1>
    )
  }
}
// Render the app 😎
render(<App />, root)
