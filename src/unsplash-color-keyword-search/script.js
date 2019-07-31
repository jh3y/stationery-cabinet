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
        color: {
          hex: getHex(r, g, b),
          rgb: { r, g, b },
        },
      })
    }
    img.onerror = reject
    img.src = src
  })

const initialState = {
  dataSet: [],
  searchTime: 0,
  searching: false,
  keyword: undefined,
}
const ACTIONS = {
  SEARCH_NEW: 'SEARCH_NEW',
  SEARCH_RESULTS: 'SEARCH_RESULTS',
}
const PREFIX = 'https://source.unsplash.com/random?'
const colorSearchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_NEW:
      return {
        searching: true,
        searchTime: Date.now(),
        dataSet: [],
        keyword: action.keyword,
      }
    case ACTIONS.SEARCH_RESULTS:
      return { searching: false, searchTime: null, dataSet: action.data }
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
    searchResults.current = []
    dispatch({ type: ACTIONS.SEARCH_NEW, keyword })
  }
  return [dataSet, searching, search]
}

const App = () => {
  const [keyword, setKeyword] = useState('')
  const [data, searching, search] = useColorSearch()
  const copy = color => {
    return color
  }
  return (
    <Fragment>
      <h1>Search for a color</h1>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Enter a search term"
      />
      <div className="colors">
        {data &&
          data.length !== 0 &&
          data.map((s, i) => (
            <div
              key={`color--${i}`}
              className="color"
              style={{ '--color': s.color.hex }}
              onClick={() => copy(s.color.hex)}>
              <span className="color__hex">{s.color.hex}</span>
              <img
                className={searching ? 'searching' : ''}
                src={s.src}
                key={`img--${i}`}
              />
            </div>
          ))}
      </div>
      <button onClick={() => search(keyword)}>Click Me</button>
    </Fragment>
  )
}
render(<App />, rootNode)
