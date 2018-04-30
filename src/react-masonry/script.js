const { createContext, Component, Children, Fragment } = React

const { render } = ReactDOM

const css = styled.css
const keyframes = styled.keyframes
const styled = styled.default
const unsplashPrefix = 'https://source.unsplash.com/random/'

/**
 * Generate the order value for nth-child panels
 * based on the number of items and the current number
 * of columns for the current media query
 * @param {Number} numberOfItems
 * @param {Number} columns
 */
const getOrderString = (numberOfItems, columns) => {
  let orderString = ''
  for (let p = 1; p < numberOfItems + 1; p++) {
    const order = p % columns === 0 ? columns : p % columns
    orderString += `
      &:nth-child(${p}) {
        order: ${order};
      }
    `
  }
  return orderString
}

/**
 * Generate media queries for configuration breakpoints
 * This entails setting the width of Panels at different viewport width
 * @param {Number} numberOfItems
 */
const generateMedia = (numberOfItems, config) => {
  let mediaString = ''
  for (let breakpoint of Object.keys(config.breakpoints)) {
    const value = config.breakpoints[breakpoint]
    const columns = config.cols[breakpoint]
    mediaString += `
    @media (min-width: ${value}px) {
      .masonry-panel {
        width: ${100 / columns}%;
        ${css`
          ${getOrderString(numberOfItems, columns)};
        `}
      }
    }
  `
  }
  return mediaString
}

/**
 * The container for our Masonry layout
 * If there is configuration and we have children, then generate media queries
 */
const MasonryContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: ${p => p.height === 0 ? '100vh' : `${p.height}px`};
  width: ${p => p.width ? `${p.width}px` : `${window.innerWidth}px`};
  overflow: hidden;
  ${p =>
    p.config &&
    p.itemCount &&
    css`
      ${generateMedia(p.itemCount, p.config)};
    `};
  &:before,
  &:after {
    content: "";
    visibility: ${p => p.loadingContent ? 'visible' : 'hidden'};
  }
  &:after {
    position: fixed;
    height: 50px;
    width: 50px;
    border-radius: 100%;
    border-width: 10px;
    border-color: white;
    border-top-color: rebeccapurple;
    border-bottom-color: rebeccapurple;
    border-style: solid;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -25px;
    animation: spin 1s infinite linear;
  }
  &:before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #111;
    ${p => p.loadingContent ? '' : 'animation: fadeOut 1s'}
    transition: visibility 1s linear;
  }
`

/**
 * Simple panel elements
 * Don't have anything special happening
 * The masonry-panel class is exposed so can be styled with CSS
 */
const MasonryPanel = styled.div`
  overflow: hidden;
`

const MasonryPanelContent = styled.div`
  overflow: hidden;
`

/**
 * Padding elements that aid with making the container flow correctly
 * It also aids in making every column of equal height
 */
const MasonryPad = styled.div`
  height: ${p => p.height}px;
  order: ${p => p.order};
`

/**
 * className reference
 */
const CLASSES = {
  CONTAINER: 'masonry',
  PANEL: 'masonry-panel',
}

/**
 * Masonry Class
 */
class Masonry extends Component {
  state = {
    heights: [],
    loading: true,
    maxHeight: 0,
    pads: [],
  }
  /**
   * Once mounted, invoke imagesLoaded on the container element
   * When images load, layout the container
   * There is a trick here to also define the height of the image
   * so we don't get float value heights like 450.2876 that can break the layout
   * The window resizing should really be debounced 😅
   * */ componentDidMount = () => {
     const load = imagesLoaded(this.container, (instance) => {
      this.layout()
      this.setState({
        loading: false,
      })

    })
    load.on('progress', (instance, image) => {
      // This trick allows us to avoid any floating pixel sizes 👍
      image.img.style.height = image.img.height
      image.img.setAttribute('height', image.img.height)
      // image.img.classList.remove('loading')
      // NOTE: Not the cleanest thing to do here but this is a demo 😅
      const parentPanel = image.img.parentNode.parentNode
      parentPanel.setAttribute('style', `height: ${image.img.height}px`)
      parentPanel.classList.remove(`${CLASSES.PANEL}--loading`)
      this.layout()
    })
    window.addEventListener('resize', _.debounce(this.layout, 0))
  }
  /**
   * Wipe the component state and reset it default, Don't think this is necessary as setState overrides anyway
   */
  // reset = () => {
  //   // this.setState({
  //   //   heights: [],
  //   //   loading: false,
  //   //   maxHeight: 0,
  //   //   pads: [],
  //   // })
  // }
  /**
   * Trick here is to populate an array of column heights based on the panels
   * Referencing the panel order, the column heights are generated
   */ populateHeights = () => {
    const { container, state } = this
    const heights = []
    const panels = container.querySelectorAll(`.${CLASSES.PANEL}`)
    for (let p = 0; p < panels.length; p++) {
      let panel = panels[p]
      const { order: cssOrder, msFlexOrder, height } = getComputedStyle(panel)
      const order = cssOrder || msFlexOrder
      if (!heights[order - 1]) heights[order - 1] = 0
      heights[order - 1] = heights[order - 1] + parseInt(height, 10)
    }
    this.setState({ heights })
  }
  /**
   * Set the layout height based on referencing the content cumulative height
   * This probably doesn't need its own function but felt right to be nice
   * and neat
   */ setLayout = () => {
    const { container, state } = this
    const { heights } = state
    // It's tricky to get everything right just down to the pixel with random dynamic height images
    // Sometimes it doesn't play nice 😢
    // So add some leniency to the height of the layout
    const leniency = 0
    const maxHeight = Math.max(...heights) + leniency
    this.setState({ maxHeight })
  }
  /**
   * Pad out layout columns with padding elements that make heights equal
   */ pad = () => {
    const { container, state } = this
    const { heights, maxHeight } = state
    const pads = []
    heights.map((height, idx) => {
      if (height < maxHeight && height > 0) {
        pads.push({
          height: maxHeight - height,
          order: idx + 1,
        })
      }
    })
    this.setState({ pads })
  }
  /**
   * Resets and lays out elements
   */ layout = () => {
    const { populateHeights, setLayout, pad } = this
    populateHeights()
    setLayout()
    pad()
  }
  render = () => {
    const { loading, pads } = this.state
    const { children, config } = this.props
    const iterableChildren = Children.toArray(children)
    return (
      <MasonryContainer
        config={config}
        className={`${CLASSES.CONTAINER}`}
        itemCount={iterableChildren.length}
        loadingContent={loading}
        height={loading ? window.innerHeight : this.state.maxHeight}
        innerRef={container => (this.container = container)}>
        {iterableChildren.map((child, idx) => (
          <MasonryPanel className={`${CLASSES.PANEL} ${CLASSES.PANEL}--loading`} key={`masonry-panel--${idx}`}>
            <MasonryPanelContent>{child}</MasonryPanelContent>
          </MasonryPanel>
        ))}
        {pads.map((pad, idx) => (
          <MasonryPad
            order={pad.order}
            height={pad.height}
            key={`masonry-pad--${idx}`}
          />
        ))}
      </MasonryContainer>
    )
  }
}
/**
 * Set up for creating a random array of image sources
 */ const getUrl = () => {
  const imageIndex = Math.floor(20 * Math.random())
  const imageWidth = 400
  const imageHeight = Math.floor(Math.random() * imageWidth + 200)
  return `${unsplashPrefix}${imageWidth}x${imageHeight}?bear,cat&v=${imageIndex}`
}
const populateImages = () => {
  const images = []
  for (let i = 0; i < 20; i++) images.push(getUrl())
  return images.map((img, idx) => (
    <img className="loading" key={`img--${idx}`} src={img} />
  ))
}
/**
 * Basic App Component to show off our Masonry Layout
 */ class App extends Component {
  static defaultProps = {
    masonryConfig: {
      breakpoints: {
        sm: 430,
        md: 768,
        lg: 992,
        xl: 1500,
      },
      cols: {
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      },
    },
  }
  render = () => {
    return (
      <Masonry config={this.props.masonryConfig}>{populateImages()}</Masonry>
    )
  }
} // Render the app 😎
render(<App />, root)
