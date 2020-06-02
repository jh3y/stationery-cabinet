const {
  React: { Fragment, useCallback, useState, useRef, useEffect },
  ReactDOM: { render, createPortal },
  styled,
  PropTypes: T,
  dat: { GUI },
  confirm,
} = window

const CONFIG = {
  height: 10,
  width: 10,
  size: 10,
  color: '#e74c3c',
  darkMode:
    window.localStorage.getItem('pixelator') &&
    JSON.parse(window.localStorage.getItem('pixelator')).darkMode
      ? JSON.parse(window.localStorage.getItem('pixelator')).darkMode
      : false,
  debug: false,
  zoom: 1,
}

const downloadFile = (content, type, name) => {
  const FILE = new Blob([content], { type: type })
  const FILE_URL = URL.createObjectURL(FILE)
  const link = document.createElement('a')
  link.href = FILE_URL
  link.download = name || 'pixel-drawing'
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(FILE_URL)
}

// App Container

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: scale(var(--zoom, 1));
  max-height: 100vh;
  & > * + * {
    margin-top: 2rem;
  }
`

// End App Container

// Pixel Canvas Component
const Grid = styled.div`
  display: grid;
  background: hsl(0, 0%, calc(var(--darkness, 100) * 1%));
  grid-template-rows: repeat(${p => p.height}, ${p => p.size}px);
  grid-template-columns: repeat(${p => p.width}, ${p => p.size}px);
`
const Cell = styled.div`
  background: var(--color, transparent);
  border: 1px solid var(--color, hsl(0, 0%, 40%));
  color: red;
`
const PixelCanvas = ({ color, erase, cells, size, height, width }) => {
  const gridRef = useRef(null)
  const erasing = useRef(false)
  const update = e => {
    if (e.target.parentNode === gridRef.current) {
      e.target.style.setProperty('--color', erasing.current ? null : color)

      cells[
        parseInt(e.target.getAttribute('data-index'), 10)
      ].color = erasing.current ? null : color
    }
  }
  const end = e => {
    gridRef.current.removeEventListener('pointermove', update)
    window.removeEventListener('pointerup', end)
    erasing.current = false
  }

  const start = e => {
    if (e.button === 2) {
      e.preventDefault()
      erasing.current = true
    }
    update(e)
    gridRef.current.addEventListener('pointermove', update)
    window.addEventListener('pointerup', end)
  }

  useEffect(() => {
    for (const cell of gridRef.current.children) {
      cell.removeAttribute('style')
    }
  }, [height, width])

  useEffect(() => {
    for (let c = 0; c < cells.length; c++) {
      gridRef.current.children[c].removeAttribute('style')
      if (cells[c].color)
        gridRef.current.children[c].style.setProperty('--color', cells[c].color)
    }
  }, [cells])

  return (
    <Grid
      onPointerDown={start}
      onContextMenu={e => {
        e.preventDefault()
        return false
      }}
      ref={gridRef}
      width={width}
      height={height}
      size={size}>
      {cells.map((c, index) => {
        return <Cell key={index} data-index={index} index={index} />
      })}
    </Grid>
  )
}
PixelCanvas.propTypes = {
  color: T.string,
  erase: T.bool,
  cells: T.arrayOf(
    T.shape({
      color: T.string,
    })
  ),
  size: T.number,
  width: T.number,
  height: T.number,
}
// End Pixel Canvas Component

// Output/Debugging components
const OutputDrawer = styled.details`
  position: fixed;
  top: 1rem;
  left: 1rem;
  outline: transparent;
  color: hsl(0, 0%, calc((100 - var(--darkness, 90)) * 1%));
`
const OutputTitle = styled.summary`
  outline: transparent;
`

const DebugContainer = styled.div`
  height: ${p => p.height * p.size}px;
  width: ${p => p.width * p.size}px;
  overflow: hidden;
  position: relative;
`

const Debug = styled.div`
  height: ${p => p.height}px;
  width: ${p => p.width}px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:after {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-${p => p.translateX}px, -${p => p.translateY}px);
    box-shadow: ${p => p.shadow};
  }
`

const Output = ({ height, width, size, shadow, translateX, translateY }) => {
  return createPortal(
    <OutputDrawer>
      <OutputTitle>See output</OutputTitle>
      <DebugContainer width={width} height={height} size={size}>
        <Debug
          shadow={shadow}
          width={size}
          height={size}
          translateX={translateX}
          translateY={translateY}
        />
      </DebugContainer>
    </OutputDrawer>,
    document.body
  )
}

// End Output/Debugging components

// Snapshots Component that is injected into Dat.GUI
const Snapshots = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`
const Snapshot = styled.button`
  background: none;
  height: 44px;
  width: 44px;
  flex: 0 0 44px;
  padding: 0;
  border: 0;
  position: relative;
  appearance: none;
  cursor: pointer;

  &:hover {
    z-index: 2;
    transform: scale(1.1);
    transition: 0.15s ease 0s;
  }

  & > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    transform: translate(-50%, -50%) scale(${p => p.scale});
  }
`

const SnapshotsContainer = styled.li`
  height: auto !important;
`

const ControllerSnapshots = ({ snapshots, onChange, parent }) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <SnapshotsContainer className="cr snapshot-gallery">
      {snapshots.length === 0 && 'No stored snapshots'}
      {snapshots.length > 0 && (
        <Snapshots>
          {snapshots.map(snapshot => {
            const {
              created,
              width,
              height,
              shadow,
              size,
              translateX,
              translateY,
              snapshotScale,
            } = snapshot
            return (
              <Snapshot
                onContextMenu={e => {
                  e.preventDefault()
                  return false
                }}
                onPointerDown={e => onChange(e, created, snapshot)}
                scale={snapshotScale}
                key={created}>
                <DebugContainer width={width} height={height} size={size}>
                  <Debug
                    shadow={shadow}
                    width={size}
                    height={size}
                    translateX={translateX}
                    translateY={translateY}
                  />
                </DebugContainer>
              </Snapshot>
            )
          })}
        </Snapshots>
      )}
    </SnapshotsContainer>,
    parent.current.domElement.querySelector('ul')
  )
}
ControllerSnapshots.propTypes = {
  snapshots: T.arrayOf(T.shape({})),
  onChange: T.func,
}
// END Snapshots Components

// Color Palette component that gets injected into Dat.GUI
const PaletteContainer = styled.li`
  height: auto !important;
  border-left-color: ${p => p.color};
`

const Palette = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const ColorSwatch = styled.button`
  height: 44px;
  width: 44px;
  flex: 0 0 44px;
  cursor: pointer;
  background-color: ${p => p.color};
  border: 2px solid ${p => (p.active ? 'white' : p.color)};
  &:hover {
    z-index: 2;
    transform: scale(1.1);
    transition: 0.15s ease 0s;
  }
`
const ControllerPalette = ({ palette, color, onChange, parent }) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <PaletteContainer
      className="cr color color-palette"
      style={{ borderLeftColor: color }}>
      <Palette>
        {palette.map(c => (
          <ColorSwatch
            key={c}
            active={color === c}
            color={c}
            onContextMenu={e => {
              e.preventDefault()
              return false
            }}
            onPointerDown={e => onChange(e, c)}
          />
        ))}
      </Palette>
    </PaletteContainer>,
    parent.current.domElement.querySelector('ul')
  )
}
ControllerPalette.propTypes = {
  color: T.string,
  palette: T.arrayOf(T.string),
  onChange: T.func,
}
// End Color Palette component

const ActionButton = styled.button`
  background: transparent;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  text-align: left;
  display: block;
  color: #eee;
  outline: transparent;
`
const Actions = ({ parent, onCss, onSvg, onSnapshot, onImage, onClear }) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <Fragment>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onCss}
          className="property-name">
          Copy CSS
        </ActionButton>
      </li>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onSvg}
          className="property-name">
          Save SVG
        </ActionButton>
      </li>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onImage}
          className="property-name">
          Save PNG
        </ActionButton>
      </li>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onSnapshot}
          className="property-name">
          Store snapshot
        </ActionButton>
      </li>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onClear}
          className="property-name">
          Clear canvas
        </ActionButton>
      </li>
    </Fragment>,
    parent.current.domElement.querySelector('ul')
  )
}
Actions.propTypes = {
  onClear: T.func,
  onCss: T.func,
  onSvg: T.func,
  onImage: T.func,
  onSnapshot: T.func,
  parent: T.node,
}

const App = () => {
  const [size, setSize] = useState(CONFIG.size)
  const [width, setWidth] = useState(CONFIG.width)
  const [height, setHeight] = useState(CONFIG.height)
  const [color, setColor] = useState(CONFIG.color)
  const [debugging, setDebugging] = useState(CONFIG.debug)
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('pixelator') &&
      JSON.parse(window.localStorage.getItem('pixelator')).darkMode
      ? JSON.parse(window.localStorage.getItem('pixelator')).darkMode
      : CONFIG.darkMode
  )
  // Purely as a placeholder to trigger a re-render
  const [viewing, setViewing] = useState(false)
  const [palette, setPalette] = useState(
    window.localStorage.getItem('pixelator') &&
      JSON.parse(window.localStorage.getItem('pixelator')).palette
      ? [...JSON.parse(window.localStorage.getItem('pixelator')).palette]
      : [CONFIG.color]
  )
  const [shadow, setShadow] = useState('')
  const [loadingSnapshot, setLoadingSnapshot] = useState(false)
  const [snapshots, setSnapshots] = useState(
    window.localStorage.getItem('pixelator') &&
      JSON.parse(window.localStorage.getItem('pixelator')).snapshots
      ? [...JSON.parse(window.localStorage.getItem('pixelator')).snapshots]
      : []
  )
  const colorControllerRef = useRef(null)
  const colorFolderRef = useRef(null)
  const snapshotFolderRef = useRef(null)
  const actionsFolderRef = useRef(null)
  const settingsFolderRef = useRef(null)
  const controllerRef = useRef(null)
  // const [processing, setProcessing] = useState(false)
  const [processingSnapshot, setProcessingSnapshot] = useState(false)
  const [translateX, setTranslateX] = useState(null)
  const [translateY, setTranslateY] = useState(null)
  const snapshotRef = useRef(null)
  const cellRef = useRef([...new Array(height * width).fill().map(() => ({}))])

  const deleteSnapshot = created => {
    const newSnapshots = snapshots.filter(
      snapshot => snapshot.created !== created
    )
    setSnapshots(newSnapshots)
    window.localStorage.setItem(
      'pixelator',
      JSON.stringify({
        darkMode,
        snapshots: newSnapshots,
        palette,
      })
    )
  }

  const handleSnapshot = (e, created, snapshot) => {
    e.preventDefault()
    if (e.button === 2) {
      if (confirm('Are you sure you want to delete that snapshot?')) {
        deleteSnapshot(created)
      }
    } else {
      snapshotRef.current = snapshot
      setLoadingSnapshot(true)
    }
  }

  const deletePaletteColor = color => {
    const newPalette = palette.filter(c => c !== color)
    setPalette(newPalette)
    window.localStorage.setItem(
      'pixelator',
      JSON.stringify({
        darkMode,
        snapshots,
        palette: newPalette,
      })
    )
  }

  const onPaletteChange = (e, c) => {
    e.preventDefault()
    if (e.button === 2) {
      if (
        confirm('Are you sure you want to remove that color from the palette?')
      ) {
        deletePaletteColor(c)
      }
    } else {
      setColor(c)
    }
  }

  const generateShadow = useCallback(() => {
    // Work out translation based on width, height, and size
    // translateX half of the width plus half of the size
    const translateX = width * size * 0.5 + size * 0.5
    const translateY = height * size * 0.5 - size * 0.5
    // generate the box shadow
    // Iterate over the cell reference
    let str = ``
    for (let c = 0; c < cellRef.current.length; c++) {
      const x = (c % width) + 1
      const y = Math.floor(c / width)
      // console.info(x, y)
      if (cellRef.current[c].color) {
        // Create a box shadow string and append it to the str
        str += `${x * size}px ${y * size}px 0 0 ${cellRef.current[c].color},`
      }
    }
    const SHADOW =
      str.trim() === '' ? 'none' : str.substring(0, str.lastIndexOf(','))
    setTranslateX(translateX)
    setTranslateY(translateY)
    setShadow(SHADOW)
    return SHADOW
  }, [height, size, width])

  const onCss = () => {
    const shadow = generateShadow()
    const FILE_CONTENT = `.element {
  height: ${height}px;
  width: ${width}px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.element:after {
  content: '';
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-${width * size * 0.5 + size * 0.5}px, -${height *
      size *
      0.5 +
      size * 0.5}px);
  box-shadow: ${shadow};
}
    `
    downloadFile(FILE_CONTENT, 'text/css', 'box-shadow-pixel-sprite.css')
  }
  const onSvg = () => {
    // Generate an SVG File
    // Create the SVG and then create a blob from outerHTML
    const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    // set width and height
    SVG.setAttribute('width', width * size)
    SVG.setAttribute('height', height * size)
    SVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    SVG.setAttribute('viewBox', `0 0 ${width * size} ${height * size}`)
    for (let c = 0; c < cellRef.current.length; c++) {
      const x = c % width
      const y = Math.floor(c / width)
      // console.info(x, y)
      if (cellRef.current[c].color) {
        const RECT = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        )
        RECT.setAttribute('width', size)
        RECT.setAttribute('height', size)
        RECT.setAttribute('fill', cellRef.current[c].color)
        RECT.setAttribute('x', x * size)
        RECT.setAttribute('y', y * size)
        SVG.appendChild(RECT)
      }
    }

    // create a circle
    // const cir1 = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'circle'
    // )
    downloadFile(SVG.outerHTML, 'text/svg', 'shadow.svg')
  }
  const onClear = () => {
    cellRef.current = [...new Array(height * width).fill().map(() => ({}))]
    setViewing(new Date().getTime())
  }
  const onSnapshot = () => {
    generateShadow()
    setProcessingSnapshot(true)
  }
  const onImage = () => {}

  useEffect(() => {
    if (loadingSnapshot) {
      const { height, created, width, size, cells } = snapshotRef.current
      cellRef.current = JSON.parse(cells)
      setHeight(height)
      setWidth(width)
      setSize(size)
      setViewing(created)
      setLoadingSnapshot(false)
      generateShadow()
    }
  }, [generateShadow, loadingSnapshot])

  useEffect(() => {
    if (controllerRef.current) return
    const changeDimension = changer => dimension => {
      if (
        confirm(
          'Are you sure? Making this change will wipe your current canvas.'
        )
      ) {
        cellRef.current = [
          ...new Array(CONFIG.height * CONFIG.width).fill().map(() => ({})),
        ]
        changer(dimension)
        setShadow(null)
      }
    }
    controllerRef.current = new GUI()
    const DIMENSIONS = controllerRef.current.addFolder('Dimensions')
    DIMENSIONS.add(CONFIG, 'height', 0, 50, 1)
      .onFinishChange(changeDimension(setHeight))
      .name('Canvas height')
    DIMENSIONS.add(CONFIG, 'width', 0, 50, 1)
      .onFinishChange(changeDimension(setWidth))
      .name('Canvas width')
    DIMENSIONS.add(CONFIG, 'size', 0, 20, 1)
      .onFinishChange(size => {
        setSize(size)
        // Will trigger shadow generation
        generateShadow()
      })
      .name('Pixel size')

    colorFolderRef.current = controllerRef.current.addFolder('Color')
    colorControllerRef.current = colorFolderRef.current
      .addColor(CONFIG, 'color')
      .onFinishChange(color => {
        setColor(color)
      })
      .name('Color')

    snapshotFolderRef.current = controllerRef.current.addFolder('Snapshots')
    settingsFolderRef.current = controllerRef.current.addFolder('Settings')
    settingsFolderRef.current
      .add(CONFIG, 'darkMode')
      .onChange(setDarkMode)
      .name('Dark mode')
    settingsFolderRef.current
      .add(CONFIG, 'debug')
      .onChange(setDebugging)
      .name('Show debug output')
    const updateZoom = value => {
      document.documentElement.style.setProperty('--zoom', value)
      // TODO: Should we store the zoom in localStorage
    }
    const ZOOM = settingsFolderRef.current
      .add(CONFIG, 'zoom', 1, 10, 0.1)
      .onChange(updateZoom)
      .name('Zoom')
    // Add actions folder for buttons
    actionsFolderRef.current = controllerRef.current.addFolder('Actions')

    // Try wheel zoom
    const handleZoom = e => {
      const STEP = 0.1
      const D = Math.max(-STEP, Math.min(STEP, e.wheelDeltaY || -e.detail))
      CONFIG.zoom = Math.min(10, Math.max(CONFIG.zoom - D, 1))
      ZOOM.updateDisplay()
      updateZoom(CONFIG.zoom)
    }
    document.querySelector('#app').addEventListener('wheel', handleZoom)

    // set a state variable to trigger the intial view?
    setViewing(new Date().getTime())
  }, [generateShadow])

  useEffect(() => {
    window.localStorage.setItem(
      'pixelator',
      JSON.stringify({
        darkMode,
        palette: [...palette, color],
        snapshots,
      })
    )
  }, [color, darkMode, palette, snapshots])

  useEffect(() => {
    // eslint-disable-next-line
    document.documentElement.style.setProperty(
      '--darkness',
      darkMode ? 10 : 100
    )
    colorControllerRef.current.setValue(color)
    window.localStorage.setItem(
      'pixelator',
      JSON.stringify({
        darkMode: darkMode ? true : false,
        palette: palette.indexOf(color) === -1 ? [...palette, color] : palette,
        snapshots,
      })
    )
    if (palette.indexOf(color) === -1) setPalette([...palette, color])
  }, [color, darkMode, palette, snapshots])

  // useEffect(() => {
  //   if (processing) {
  //     generateShadow()
  //   }
  // }, [generateShadow, height, processing, size, width])

  useEffect(() => {
    if (processingSnapshot) {
      if (
        snapshots.filter(snap => snap.cells === JSON.stringify(cellRef.current))
          .length === 0 &&
        cellRef.current.filter(c => c.color !== undefined).length !== 0
      ) {
        // Take all the current state, store it in localStorage.
        // Work out a scale. Save it as a snapshot.
        const SNAPSHOT = {
          height,
          width,
          size,
          color,
          created: new Date().getTime(),
          cells: JSON.stringify(cellRef.current),
          translateX,
          translateY,
          shadow,
          // Scale it down so it fits in a 44px button
          snapshotScale: 44 / (Math.max(width, height) * size),
        }

        window.localStorage.setItem(
          'pixelator',
          JSON.stringify({
            palette,
            snapshots: [...snapshots, SNAPSHOT],
          })
        )
        setSnapshots([...snapshots, SNAPSHOT])
      }
      setProcessingSnapshot(false)
    }
  }, [
    color,
    generateShadow,
    height,
    palette,
    processingSnapshot,
    shadow,
    size,
    snapshots,
    translateX,
    translateY,
    width,
  ])

  return (
    <Container>
      <PixelCanvas
        size={size}
        width={width}
        height={height}
        cells={cellRef.current}
        color={color}
        key={viewing}
      />
      <ControllerPalette
        color={color}
        palette={palette}
        parent={colorFolderRef}
        onChange={onPaletteChange}
      />
      <ControllerSnapshots
        snapshots={snapshots}
        onChange={handleSnapshot}
        parent={snapshotFolderRef}
      />
      <Actions
        onCss={onCss}
        onSvg={onSvg}
        onSnapshot={onSnapshot}
        onImage={onImage}
        onClear={onClear}
        parent={actionsFolderRef}
      />
      {debugging && (
        <Output
          shadow={shadow}
          width={width}
          height={height}
          size={size}
          translateX={translateX}
          translateY={translateY}
        />
      )}
    </Container>
  )
}

render(<App />, document.querySelector('#app'))
