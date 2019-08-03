const { React, ReactDOM } = window
const { useEffect, useState, useRef, useReducer, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')
// const INTERVAL = 150
const LIMIT = 8000

const getHex = (r, g, b) =>
  `#${r.toString(16).length === 1 ? `0${r.toString(16)}` : r.toString(16)}${
    g.toString(16).length === 1 ? `0${g.toString(16)}` : g.toString(16)
  }${b.toString(16).length === 1 ? `0${b.toString(16)}` : b.toString(16)}`

const getImageData = src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = 1
      canvas.width = 1
      context.drawImage(img, 0, 0, 1, 1)
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data
      resolve({
        src,
        copied: false,
        color: {
          dark: [r, g, b].filter(v => v > 200).length >= 2,
          hex: getHex(r, g, b),
          rgb: { r, g, b },
        },
      })
    }
    img.onerror = reject
    img.src = src
  })

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
const PREFIX = 'https://source.unsplash.com/random?'
const colorSearchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_NEW:
      return {
        searching: true,
        searchTime: Date.now(),
        dataSet: undefined,
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
const useColorSearch = () => {
  const searchResults = useRef(null)
  const [{ searchTime, searching, dataSet, keyword }, dispatch] = useReducer(
    colorSearchReducer,
    initialState
  )
  const grabImages = async keyword => {
    if (!keyword) return
    const src = await (await fetch(`${PREFIX}${keyword}`)).url
    if (
      searchResults.current.filter(d => d.src === src).length &&
      Date.now() - searchTime < LIMIT
    ) {
      grabImages(keyword)
    } else {
      if (!searchResults.current.filter(d => d.src === src).length) {
        const data = await getImageData(src)
        searchResults.current.push(data)
      }
      if (Date.now() - searchTime > LIMIT) {
        dispatch({ type: ACTIONS.SEARCH_RESULTS, data: searchResults.current })
      } else {
        grabImages(keyword)
      }
    }
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
  const [data, searching, search, copy] = useColorSearch()
  const onSubmit = e => {
    e.preventDefault()
    search(keyword)
  }
  const copyToClipboard = color => {
    invisiput.current.value = color
    invisiput.current.select()
    document.execCommand('copy')
    copy(color)
  }
  return (
    <Fragment>
      <form onSubmit={onSubmit} className="input-container">
        <input ref={invisiput} className="input-invisible" />
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
      <div className="colors">
        {data &&
          data.length !== 0 &&
          data.map((s, i) => (
            <div
              key={`color--${i}`}
              className="color"
              style={{
                '--color': s.color.hex,
                '--r': s.color.rgb.r,
                '--g': s.color.rgb.g,
                '--b': s.color.rgb.b,
              }}
              onClick={() => copyToClipboard(s.color.hex)}>
              <span
                className={`color__hex ${
                  s.color.dark ? 'color__hex--dark' : ''
                }`}>
                {s.copied ? 'Copied!' : s.color.hex}
              </span>
              <img
                className={searching ? 'searching' : ''}
                src={s.src}
                key={`img--${i}`}
              />
            </div>
          ))}
        {data && data.length === 0 && <h1>No results! 😭</h1>}
      </div>
    </Fragment>
  )
}
render(<App />, rootNode)
