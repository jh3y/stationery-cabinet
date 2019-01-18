const { styled, React, ReactDOM } = window
const { useState, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

// Change these values to experiment with different looks
const UPPER_SIZE = 3
const UPPER_SPAN = 6

const gen = limit =>
  new Array(limit)
    .fill()
    .map(() => `${Math.floor(Math.random() * UPPER_SPAN) + 1}fr`)
    .join(' ')

const getMove = () => styled.keyframes`
  0%,
  100% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  10% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  20% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  30% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  40% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  50% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  60% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  70% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  80% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
  90% {
    grid-template-columns: ${gen(4)};
    grid-template-rows: ${gen(5)};
  }
`

const Mondrian = styled.div`
  background: rgb(7, 9, 8);
  border: 10px solid rgb(7, 9, 8);
  box-shadow: 5px 10px 10px #aaa;
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: 1fr;
  grid-gap: 10px;
  height: 310px;
  width: 250px;
  animation: ${getMove()} 8s infinite ease;
`

const Block = styled.div`
  background: var(--bg);
  grid-column: span var(--col);
  grid-row: span var(--row);

  &:nth-of-type(1),
  &:nth-of-type(5) {
    --bg: rgb(242, 245, 241);
  }
  &:nth-of-type(2),
  &:nth-of-type(6) {
    // --bg: rgb(248, 217, 45);
    --bg: #fdd835;
  }
  &:nth-of-type(3),
  &:nth-of-type(7) {
    // --bg: rgb(11, 84, 164);
    --bg: #1e88e5;
  }
  &:nth-of-type(4),
  &:nth-of-type(8) {
    // --bg: rgb(214, 0, 20);
    --bg: #f44336;
  }
`

const random = () => Math.floor(Math.random() * UPPER_SIZE) + 1
const generateSpans = () => new Array(6).fill().map(() => [random(), random()])
const App = () => {
  const [spans, setSpans] = useState(generateSpans())
  return (
    <Fragment>
      <Mondrian>
        {spans.map((b, i) => (
          <Block key={`block--${i}`} style={{ '--col': b[0], '--row': b[1] }} />
        ))}
      </Mondrian>
      <button onClick={() => setSpans(generateSpans())}>Regenerate</button>
    </Fragment>
  )
}

render(<App />, rootNode)
