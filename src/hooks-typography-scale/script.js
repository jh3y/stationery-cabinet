const { React, ReactDOM } = window
const { useEffect, useState, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const App = () => {
  const [size, setSize] = useState(16)
  useEffect(
    () => {
      document.documentElement.style.setProperty('--size', size)
    },
    [size]
  )
  return (
    <Fragment>
      <div className="size-selector">
        {[16, 32, 48].map(s => (
          <button
            key={`size--${s}`}
            onClick={() => setSize(s)}
            style={{ fontSize: `${s}px` }}>
            A
          </button>
        ))}
      </div>
      <h1>Lorem ipsum...</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue
        vestibulum maximus. Proin felis metus, condimentum ut malesuada a,
        hendrerit ac ligula.
      </p>
    </Fragment>
  )
}

render(<App />, rootNode)
