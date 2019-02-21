const { React, ReactDOM } = window
const { useEffect, useState, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

/**
 * A hook that provides a way to hook into users typing out easter egg codes 😅
 * @param {String} code - Cheat code for user to enter on keypress
 */ const useCheatCode = code => {
  const [active, setActive] = useState(false)
  const keyed = useRef([])
  const splitCode = useRef(code.split(''))
  const handlePress = e => {
    keyed.current = keyed.current.length ? [...keyed.current, e.key] : [e.key]
    if (
      splitCode.current
        .slice(0, keyed.current.length)
        .every((v, i) => v === keyed.current[i]) &&
      keyed.current.length === splitCode.current.length
    ) {
      // We got a match, let's do something cool 🎉
      window.removeEventListener('keypress', handlePress)
      setActive(true)
    } else if (
      !splitCode.current
        .slice(0, keyed.current.length)
        .every((v, i) => v === keyed.current[i])
    ) {
      // No match so reset 👎
      keyed.current = []
    }
  }
  useEffect(() => {
    window.addEventListener('keypress', handlePress)
    return () => {
      window.removeEventListener('keypress', handlePress)
    }
  }, [])
  return active
}
const App = () => {
  const code = 'SHOW EASTER EGGS'
  const showEgg = useCheatCode(code)
  return (
    <Fragment>
      <h1 className={showEgg ? 'showing' : ''}>
        {showEgg ? 'Easter eggs! 🙌' : `Type "${code}" 🤓`}
      </h1>
      {showEgg && (
        <img src="https://images.unsplash.com/photo-1538560598041-98222f66245f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80" />
      )}
    </Fragment>
  )
}
render(<App />, rootNode)
