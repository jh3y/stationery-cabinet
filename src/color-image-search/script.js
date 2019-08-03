const { React, ReactDOM } = window
const { useEffect, useState, useRef, useReducer } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const initialState = {
  dataSet: undefined,
  searchTime: 0,
  searching: false,
  keyword: undefined,
}
const ACTIONS = {
  SEARCH_NEW: 'SEARCH_NEW',
  SEARCH_RESULTS: 'SEARCH_RESULTS',
  COPY: 'COPY',
}

const colorSearchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_NEW:
      return {
        searching: true,
        searchTime: Date.now(),
        dataSet: state.dataSet,
        keyword: action.keyword,
      }
    case ACTIONS.SEARCH_RESULTS:
      return { searching: false, searchTime: null, dataSet: action.data }
    case ACTIONS.COPY:
      return {
        searching: false,
        searchTime: null,
        dataSet: state.dataSet.map(c => ({
          ...c,
          copied: c.color.hex === action.color,
        })),
      }
    default:
      return state
  }
}
const URL = 'https://color-image-search.herokuapp.com/search/'
const useColorSearch = () => {
  const searchResults = useRef(null)
  const [{ searchTime, searching, dataSet, keyword }, dispatch] = useReducer(
    colorSearchReducer,
    initialState
  )
  const grabImages = async keyword => {
    if (!keyword) return
    const data = await (await (await fetch(`${URL}${keyword}`)).json()).images
    dispatch({ type: ACTIONS.SEARCH_RESULTS, data })
  }
  useEffect(() => {
    grabImages(keyword)
  }, [searchTime])

  const search = async keyword => {
    if (!keyword) return
    searchResults.current = []
    dispatch({ type: ACTIONS.SEARCH_NEW, keyword })
  }

  const copy = color => {
    // Copy to clipboard
    const input = document.createElement('input')
    input.value = color
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
    dispatch({ type: ACTIONS.COPY, color })
  }
  return [dataSet, searching, search, copy]
}

const App = () => {
  const [keyword, setKeyword] = useState('')
  const invisiput = useRef(null)
  const colorsRef = useRef(null)
  const formRef = useRef(null)
  // Add copy and data back in ⚠️
  const [searching, search] = useColorSearch()

  const data = new Array(12).fill().map(() => ({ color: { hex: 'red' } }))

  const onSubmit = e => {
    e.preventDefault()
    search(keyword)
  }
  // const copyToClipboard = color => {
  //   invisiput.current.value = color
  //   invisiput.current.select()
  //   document.execCommand('copy')
  //   copy(color)
  // }

  const expand = colorIndex => {
    // grab the color of a certain index from colors element.
    // Animate it to fill the entire square
    const colorEl = colorsRef.current.children[colorIndex]
    return colorEl
    // console.info(colorEl)
    // console.info(colorEl.getBoundingClientRect())
  }

  return (
    <div className="color-search">
      <input ref={invisiput} className="input-invisible" />
      <form ref={formRef} onSubmit={onSubmit} className="input-container">
        <input
          value={keyword}
          disabled={searching}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search for a color"
        />
        <button role="button" disabled={searching} onClick={onSubmit}>
          <div className="search">
            <div className="search__glass" />
            <div className="search__prongs">
              {new Array(10).fill().map((d, i) => (
                <div key={`loader-prong--${i}`} />
              ))}
            </div>
          </div>
        </button>
      </form>
      <div
        ref={colorsRef}
        className={`colors ${searching ? 'colors--searching' : ''}`}>
        {data &&
          data.length !== 0 &&
          data.map((s, i) => (
            <div
              key={`color--${i}`}
              className="color"
              style={{
                '--color': s.color.hex,
                // '--r': s.color.rgb.r,
                // '--g': s.color.rgb.g,
                // '--b': s.color.rgb.b,
              }}
              onClick={() => expand(i)}></div>
          ))}
        {data && data.length === 0 && <h1>No results! 😭</h1>}
      </div>
    </div>
  )
} // <span //   className={`color__hex ${ //     s.color.dark ? 'color__hex--dark' : '' //   }`}> //   {s.copied ? 'Copied!' : s.color.hex} // </span> // <img //   alt={s.alt_description} //   className={searching ? 'searching' : ''} //   src={s.urls.small} //   key={`img--${i}`} // />
render(<App />, rootNode)
