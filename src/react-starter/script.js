const { Component, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')
class App extends Component {
  render = () => {
    return (
      <h1>🌯</h1>
    )
  }
}

ReactDOM.render(<App/>, rootNode)