const {
  React: { Fragment, useCallback, useState, useRef, useEffect },
  ReactDOM: { render, createPortal },
  styled,
  PropTypes: T,
  dat: { GUI },
  confirm,
} = window

const STORAGE_KEY = 'jh3y-pixelator'
const CONFIG = {
  height:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).height
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).height
      : 10,
  width:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).width
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).width
      : 10,
  size:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).size
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).size
      : 10,
  radius:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).radius
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).radius
      : 0,
  color:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).color
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).color
      : '#2ecc71',
  darkMode:
    window.localStorage.getItem(STORAGE_KEY) &&
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)).darkMode
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).darkMode
      : true,
  debug: false,
  zoom: 1,
}

const downloadFile = (content, type, name) => {
  const FILE = new Blob([content], { type: type })
  const FILE_URL = URL.createObjectURL(FILE)
  const link = document.createElement('a')
  link.href = FILE_URL
  link.download = name || `${STORAGE_KEY}-creation`
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(FILE_URL)
  link.remove()
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
  --radius: ${p => p.radius};
  display: grid;
  background: hsl(0, 0%, calc(var(--darkness, 100) * 1%));
  grid-template-rows: repeat(${p => p.height}, ${p => p.size}px);
  grid-template-columns: repeat(${p => p.width}, ${p => p.size}px);
`
const Cell = styled.div`
  background: var(--color, transparent);
  border: 1px solid var(--color, hsl(0, 0%, 40%));
  border-radius: calc(var(--radius, 0) * 1%);
`
const PixelCanvas = ({ color, cells, size, height, width, radius }) => {
  const gridRef = useRef(null)
  const erasing = useRef(false)
  const update = e => {
    const cell = e.x && e.y ? document.elementFromPoint(e.x, e.y) : e.target
    // if (e.x && e.y) cell = document.elementFromPoint(e.x, e.y)
    if (
      e.target.parentNode === gridRef.current &&
      cell &&
      cell.hasAttribute('data-index')
    ) {
      cell.style.setProperty('--color', erasing.current ? null : color)
      cells[
        parseInt(cell.getAttribute('data-index'), 10)
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
      size={size}
      radius={radius}>
      {cells.map((c, index) => {
        const x = index % width
        const y = Math.floor(index / width)
        return (
          <Cell
            key={index}
            data-x={x}
            data-y={y}
            data-index={index}
            index={index}
          />
        )
      })}
    </Grid>
  )
}
PixelCanvas.propTypes = {
  color: T.string,
  cells: T.arrayOf(
    T.shape({
      color: T.string,
    })
  ),
  size: T.number,
  radius: T.number,
  width: T.number,
  height: T.number,
}
// End Pixel Canvas Component

// Output/Debugging components
// const OutputDrawer = styled.details`
//   position: fixed;
//   top: 1rem;
//   left: 1rem;
//   outline: transparent;
//   color: hsl(0, 0%, calc((100 - var(--darkness, 90)) * 1%));
// `
// const OutputTitle = styled.summary`
//   outline: transparent;
// `

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

// const Output = ({ height, width, size, shadow, translateX, translateY }) => {
//   return createPortal(
//     <OutputDrawer>
//       <OutputTitle>See CSS output (Run copy first)</OutputTitle>
//       <DebugContainer width={width} height={height} size={size}>
//         <Debug
//           shadow={shadow}
//           width={size}
//           height={size}
//           translateX={translateX}
//           translateY={translateY}
//         />
//       </DebugContainer>
//     </OutputDrawer>,
//     document.body
//   )
// }

// End Output/Debugging components

// Snapshots Component that is injected into Dat.GUI
const Snapshots = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  max-height: 194px;
  overflow: auto;
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
  max-height: 194px;
  overflow: auto;
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

// About && Help component are statically portalled into dat.gui
const List = styled.ul`
  && {
    padding: 0.5rem 0 0.5rem 1.5rem;
  }

  && li {
    border-bottom: 0;
    height: auto;
    line-height: 1.5;
  }

  && > li + li {
    margin-top: 0.5rem;
  }
`
const Help = ({ parent }) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <List
      className="help-list"
      style={{
        listStyle: 'disc',
        background: '#1a1a1a',
      }}>
      <li>Draw with left mouse button.</li>
      <li>Erase with right mouse button.</li>
      <li>Colors are automatically stored in the palette.</li>
      <li>{`Zoom in with mouse wheel or via "Settings".`}</li>
      <li>{`Save your drawing by using the "Snapshot" action.`}</li>
      <li>Delete a color or snapshot by right clicking it.</li>
      <li>
        Stores current state, snapshots, palette, settings, etc. in localStorage
      </li>
    </List>,
    parent.current.domElement.querySelector('ul')
  )
}
Help.propTypes = {
  parent: T.node,
}
const About = ({ parent }) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <li>
      Made by{' '}
      <a
        style={{ fontWeight: 'bold', color: 'white' }}
        href="https://twitter.com/jh3yy"
        target="_blank"
        rel="noopener noreferrer">
        Jhey
      </a>{' '}
      &copy; 2020
    </li>,
    parent.current.domElement.querySelector('ul')
  )
}
About.propTypes = {
  parent: T.node,
}
// End About && Help
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
const Actions = ({
  parent,
  onCss,
  onSvg,
  onSnapshot,
  onImage,
  onClear,
  onExport,
  onImport,
  onTrim,
}) => {
  if (!parent.current || !parent.current.domElement) return null
  return createPortal(
    <Fragment>
      <li
        className="cr"
        style={{ borderLeft: '3px solid hsl(120, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={() => onCss(true)}
          className="property-name">
          Save CSS
        </ActionButton>
      </li>
      <li
        className="cr"
        style={{ borderLeft: '3px solid hsl(180, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={() => onCss(false)}
          className="property-name">
          Copy CSS
        </ActionButton>
      </li>
      <li
        className="cr"
        style={{ borderLeft: '3px solid hsl(120, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={onSvg}
          className="property-name">
          Save SVG
        </ActionButton>
      </li>
      <li
        className="cr"
        style={{ borderLeft: '3px solid hsl(120, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={onImage}
          className="property-name">
          Save PNG
        </ActionButton>
      </li>
      <li className="cr" style={{ borderLeft: '3px solid hsl(60, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={onSnapshot}
          className="property-name">
          Snapshot
        </ActionButton>
      </li>
      <li className="cr" style={{ borderLeft: '3px solid hsl(60, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={onExport}
          className="property-name">
          Export
        </ActionButton>
      </li>
      <li className="cr" style={{ borderLeft: '3px solid hsl(60, 100%, 50%)' }}>
        <ActionButton
          style={{ width: '100%' }}
          onClick={onImport}
          className="property-name">
          Import
        </ActionButton>
      </li>
      <li className="cr function">
        <ActionButton
          style={{ width: '100%' }}
          onClick={onTrim}
          className="property-name">
          Trim canvas
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
  onExport: T.func,
  onImport: T.func,
  onTrim: T.func,
  parent: T.node,
}

const App = () => {
  const [size, setSize] = useState(CONFIG.size)
  const [radius, setRadius] = useState(CONFIG.radius)
  const [width, setWidth] = useState(CONFIG.width)
  const [height, setHeight] = useState(CONFIG.height)
  const [color, setColor] = useState(CONFIG.color)
  const heightRef = useRef(CONFIG.height)
  const widthRef = useRef(CONFIG.width)
  // const [debugging, setDebugging] = useState(CONFIG.debug)
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem(STORAGE_KEY) &&
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)).darkMode
      ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)).darkMode
      : CONFIG.darkMode
  )
  // Purely as a placeholder to trigger a re-render
  const [viewing, setViewing] = useState(false)
  const [palette, setPalette] = useState(
    window.localStorage.getItem(STORAGE_KEY) &&
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)).palette
      ? [...JSON.parse(window.localStorage.getItem(STORAGE_KEY)).palette]
      : [CONFIG.color]
  )
  const [shadow, setShadow] = useState('')
  const [loadingSnapshot, setLoadingSnapshot] = useState(false)
  const [snapshots, setSnapshots] = useState(
    window.localStorage.getItem(STORAGE_KEY) &&
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)).snapshots
      ? [...JSON.parse(window.localStorage.getItem(STORAGE_KEY)).snapshots]
      : []
  )
  const colorControllerRef = useRef(null)
  const colorFolderRef = useRef(null)
  const darkModeRef = useRef(darkMode)
  const snapshotFolderRef = useRef(null)
  const actionsFolderRef = useRef(null)
  const settingsFolderRef = useRef(null)
  const helpFolderRef = useRef(null)
  const aboutFolderRef = useRef(null)
  const controllerRef = useRef(null)
  // const [processing, setProcessing] = useState(false)
  const [processingSnapshot, setProcessingSnapshot] = useState(false)
  const [translateX, setTranslateX] = useState(null)
  const [translateY, setTranslateY] = useState(null)
  const snapshotRef = useRef(null)
  const cellRef = useRef([...new Array(height * width).fill().map(() => ({}))])

  const saveToStorage = useCallback(
    saveObj => {
      heightRef.current = height
      widthRef.current = width
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode,
          palette,
          snapshots,
          height,
          width,
          radius,
          size,
          color,
          ...saveObj,
        })
      )
    },
    [darkMode, palette, snapshots, height, width, radius, size, color]
  )

  const deleteSnapshot = created => {
    const newSnapshots = snapshots.filter(
      snapshot => snapshot.created !== created
    )
    setSnapshots(newSnapshots)
    window.localStorage.setItem(
      STORAGE_KEY,
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
      if (confirm('Loading a snapshot will wipe the current canvas')) {
        snapshotRef.current = snapshot
        setLoadingSnapshot(true)
      }
    }
  }

  const deletePaletteColor = color => {
    const newPalette = palette.filter(c => c !== color)
    setPalette(newPalette)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        height,
        width,
        color,

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
      CONFIG.color = c
      controllerRef.current.updateDisplay()
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
      if (cellRef.current[c].color) {
        // Create a box shadow string and append it to the str
        str += `calc(${x * size} * var(--coefficient, 1px)) calc(${y *
          size} * var(--coefficient, 1px)) 0 0 ${cellRef.current[c].color},`
      }
    }
    const SHADOW =
      str.trim() === '' ? 'none' : str.substring(0, str.lastIndexOf(','))
    setTranslateX(translateX)
    setTranslateY(translateY)
    setShadow(SHADOW)
    return SHADOW
  }, [height, size, width])

  const onCss = download => {
    const shadow = generateShadow()
    const FILE_CONTENT = `.element {
  /* Change coefficient to make responsive */
  --coefficient: 1px;
  height: calc(${size} * var(--coefficient, 1px));
  width: calc(${size} * var(--coefficient, 1px));
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
  transform: translate(calc(-${width * size * 0.5 +
    size * 0.5} * var(--coefficient, 1px)), calc(-${height * size * 0.5 +
      size * 0.5} * var(--coefficient, 1px)));
  box-shadow: ${shadow};
}
    `
    if (download) {
      downloadFile(FILE_CONTENT, 'text/css', 'box-shadow-pixel-sprite.css')
      alert('CSS file saved!')
    } else {
      // copy CSS to clipboard
      const el = document.createElement('textarea')
      el.value = FILE_CONTENT
      el.height = el.width = 0
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      alert('Image CSS saved to clipboard!')
    }
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
      if (cellRef.current[c].color) {
        const RECT = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        )
        RECT.setAttribute('width', size)
        RECT.setAttribute('height', size)
        RECT.setAttribute('rx', size * (radius / 100))
        RECT.setAttribute('fill', cellRef.current[c].color)
        RECT.setAttribute('x', x * size)
        RECT.setAttribute('y', y * size)
        SVG.appendChild(RECT)
      }
    }
    downloadFile(SVG.outerHTML, 'text/svg', 'shadow.svg')
    alert('Image saved in .svg format!')
  }
  const onClear = () => {
    if (confirm('Are you sure you wish to clear the canvas?')) {
      cellRef.current = [...new Array(height * width).fill().map(() => ({}))]
      setViewing(new Date().getTime())
    }
  }
  const onTrim = () => {
    if (
      confirm(
        'Are you sure you want to trim the canvas? Maybe snapshot the current canvas in case you want to go back.'
      )
    ) {
      // Work out how many vertical rows are empty before content
      // We know the width so go from 0 to width and check each column at a time
      const TRIM = {
        xStart: undefined,
        xEnd: undefined,
        yStart: undefined,
        yEnd: undefined,
      }
      const setTrimmingPoints = (bound, start, end, posFunc) => {
        for (let d = 0; d < bound - 1; d++) {
          if (TRIM[start]) break
          // Loop through all the cells checking for x === x and no color
          for (let c = 0; c < cellRef.current.length; c++) {
            if (TRIM[start]) break
            const col = posFunc(c)
            if (d === col && cellRef.current[c].color) {
              TRIM[start] = d
              break
            }
          }
        }
        for (let d = bound - 1; d > 0; d--) {
          if (TRIM[end]) break
          // Loop through all the cells checking for x === x and no color
          for (let c = cellRef.current.length; c > 0; c--) {
            if (TRIM[end]) break
            const col = posFunc(c)
            if (d === col && cellRef.current[c].color) {
              TRIM[end] = d + 1
              break
            }
          }
        }
      }
      setTrimmingPoints(width - 1, 'xStart', 'xEnd', c => c % width)
      setTrimmingPoints(height - 1, 'yStart', 'yEnd', c =>
        Math.floor(c / width)
      )
      const newWidth = TRIM.xEnd - TRIM.xStart
      const newHeight = TRIM.yEnd - TRIM.yStart
      if (
        TRIM.yStart === 1 &&
        TRIM.yEnd === height - 1 &&
        TRIM.xStart === 1 &&
        TRIM.xEnd === width - 1
      )
        return
      // Here you need to work out the new cell ref array based on the starting point and ending point...
      // Iterate over the original cells and create a new cell Ref based on the xStart, yStart
      const newCells = []
      for (let c = 0; c < cellRef.current.length; c++) {
        const x = c % width
        const y = Math.floor(c / width)
        if (
          x < TRIM.xEnd &&
          x >= TRIM.xStart &&
          y < TRIM.yEnd &&
          y >= TRIM.yStart
        ) {
          newCells.push({
            ...(cellRef.current[c].color && {
              color: cellRef.current[c].color,
            }),
          })
        }
      }
      cellRef.current = newCells
      CONFIG.height = newHeight
      CONFIG.width = newWidth
      heightRef.current = newHeight
      widthRef.current = newWidth
      controllerRef.current.updateDisplay()
      setWidth(newWidth)
      setHeight(newHeight)
      saveToStorage()
    }
  }
  const onSnapshot = () => {
    generateShadow()
    setProcessingSnapshot(true)
  }
  const onImage = () => {
    // The process of creating an image is to draw the cells onto an off-page canvas, convert the context
    // to a data URL and save as a png
    const CANVAS = document.createElement('canvas')
    CANVAS.width = width * size
    CANVAS.height = height * size
    const CONTEXT = CANVAS.getContext('2d')
    for (let c = 0; c < cellRef.current.length; c++) {
      if (cellRef.current[c].color) {
        const x = c % width
        const y = Math.floor(c / width)
        CONTEXT.fillStyle = cellRef.current[c].color
        CONTEXT.fillRect(x * size, y * size, size, size)
      }
    }
    // create the image URL
    const link = document.createElement('a')
    link.href = CANVAS.toDataURL()
    link.download = 'pixel-drawing.png'
    document.body.appendChild(link)
    link.click()
    link.remove()
    alert(
      'Image saved in .png format! NOTE:: If your image uses a radius, this is not translated to the png format. If you need rounded corners, use SVG and then convert to png externally.'
    )
  }

  const onExport = () => {
    const FILE_CONTENT = window.localStorage.getItem(STORAGE_KEY)
    downloadFile(FILE_CONTENT, 'application/json', `${STORAGE_KEY}-export.json`)
    alert('Export complete!')
  }

  const onImport = () => {
    // Import is a little trickier. Need to read a file and then translate its content into new state variables.
    const CHOOSE = document.createElement('input')
    CHOOSE.type = 'file'
    const importFile = e => {
      CHOOSE.remove()
      const READER = new FileReader()
      READER.onload = e => {
        // At this point loop over the imports and import any palette colors that don't exist
        // Or any snapshots that don't exist.
        const IMPORT = JSON.parse(e.target.result)
        const { palette: importPalette, snapshots: importSnapshots } = IMPORT
        if (importPalette && importPalette.length) {
          const ADD_ONS = []
          for (const COLOR of importPalette) {
            if (palette.indexOf(COLOR.toLowerCase()) === -1)
              ADD_ONS.push(COLOR.toLowerCase())
          }
          if (ADD_ONS.length > 0) {
            setPalette([...palette, ...ADD_ONS])
          }
        }
        if (importSnapshots && importSnapshots.length) {
          const ADD_ONS = []
          for (const SNAPSHOT of importSnapshots) {
            // Quite lengthy. But make sure there are no snapshots with a cellset matching what's currently available
            if (
              snapshots.filter(s => s.cells === SNAPSHOT.cells).length === 0
            ) {
              ADD_ONS.push(SNAPSHOT)
            }
          }
          if (ADD_ONS.length > 0) {
            setSnapshots([...snapshots, ...ADD_ONS])
          }
        }
        alert('Snapshots and palette imported!')
      }
      READER.readAsText(e.target.files[0])
    }
    CHOOSE.addEventListener('input', importFile)
    CHOOSE.click()
  }

  useEffect(() => {
    if (loadingSnapshot) {
      const {
        height,
        radius,
        created,
        width,
        size,
        cells,
      } = snapshotRef.current
      cellRef.current = JSON.parse(cells)
      setHeight(height)
      setWidth(width)
      setSize(size)
      setRadius(radius)
      CONFIG.size = size
      CONFIG.width = width
      CONFIG.height = height
      CONFIG.radius = radius
      heightRef.current = height
      widthRef.current = width
      controllerRef.current.updateDisplay()
      setViewing(created)
      setLoadingSnapshot(false)
      alert('Snapshot loaded')
    }
  }, [loadingSnapshot])

  useEffect(() => {
    if (height !== heightRef.current || width !== widthRef.current) {
      saveToStorage()
      heightRef.current = height
      widthRef.current = width
    }
  }, [height, width, saveToStorage])

  useEffect(() => {
    if (controllerRef.current) return
    // Set dark mode up
    document.documentElement.style.setProperty(
      '--darkness',
      darkMode ? 10 : 100
    )
    controllerRef.current = new GUI()
    const CONFIGURATION = controllerRef.current.addFolder('Configuration')
    CONFIGURATION.add(CONFIG, 'height', 2, 100, 1)
      .onFinishChange(value => {
        if (
          value !== heightRef.current &&
          confirm(
            'Are you sure? Making this change will wipe your current canvas.'
          )
        ) {
          cellRef.current = [
            ...new Array(CONFIG.height * CONFIG.width).fill().map(() => ({})),
          ]
          setHeight(value)
          heightRef.current = value
          saveToStorage()
          // setShadow(null)
        }
      })
      .name('Canvas height')
    CONFIGURATION.add(CONFIG, 'width', 2, 100, 1)
      .onFinishChange(value => {
        if (
          value !== widthRef.current &&
          confirm(
            'Are you sure? Making this change will wipe your current canvas.'
          )
        ) {
          cellRef.current = [
            ...new Array(CONFIG.height * CONFIG.width).fill().map(() => ({})),
          ]
          setWidth(value)
          widthRef.current = value
          saveToStorage()
          // setShadow(null)
        }
      })
      .name('Canvas width')
    CONFIGURATION.add(CONFIG, 'size', 0, 20, 1)
      .onFinishChange(size => {
        setSize(size)
        // Will trigger shadow generation
        // generateShadow()
      })
      .name('Pixel size')
    CONFIGURATION.add(CONFIG, 'radius', 0, 50, 1)
      .onFinishChange(size => {
        setRadius(size)
        // Will trigger shadow generation
        // generateShadow()
      })
      .name('Pixel radius')

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
    const updateZoom = value => {
      document.documentElement.style.setProperty('--zoom', value)
      // TODO: Should we store the zoom in localStorage
    }
    const ZOOM = settingsFolderRef.current
      .add(CONFIG, 'zoom', 1, 10, 0.1)
      .onChange(updateZoom)
      .name('Zoom')
    // settingsFolderRef.current
    //   .add(CONFIG, 'debug')
    //   .onChange(setDebugging)
    //   .name('Show dev debug')
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
    helpFolderRef.current = controllerRef.current.addFolder('Help')
    aboutFolderRef.current = controllerRef.current.addFolder('About')
    // set a state variable to trigger the intial view?
    setViewing(new Date().getTime())
  }, [darkMode, saveToStorage])

  useEffect(() => {
    if (palette.indexOf(color) === -1) {
      colorControllerRef.current.setValue(color)
      if (palette.indexOf(color) === -1) setPalette([...palette, color])
      saveToStorage({
        palette: palette.indexOf(color) === -1 ? [...palette, color] : palette,
      })
    }
  }, [saveToStorage, color, palette])

  useEffect(() => {
    if (darkModeRef.current !== darkMode) {
      setDarkMode(darkMode)
      document.documentElement.style.setProperty(
        '--darkness',
        darkMode ? 10 : 100
      )
      darkModeRef.current = darkMode
      saveToStorage()
    }
  }, [darkMode, saveToStorage])

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
          radius,
          created: new Date().getTime(),
          cells: JSON.stringify(cellRef.current),
          translateX,
          translateY,
          shadow,
          // Scale it down so it fits in a 44px button
          snapshotScale: 44 / (Math.max(width, height) * size),
        }

        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            palette,
            snapshots: [...snapshots, SNAPSHOT],
          })
        )
        setSnapshots([...snapshots, SNAPSHOT])
        alert('Snapshot saved')
      }
      setProcessingSnapshot(false)
    }
  }, [
    color,
    height,
    palette,
    processingSnapshot,
    shadow,
    size,
    snapshots,
    translateX,
    translateY,
    width,
    radius,
  ])

  return (
    <Container>
      <PixelCanvas
        size={size}
        radius={radius}
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
      <Help parent={helpFolderRef} />
      <About parent={aboutFolderRef} />
      <Actions
        onCss={onCss}
        onSvg={onSvg}
        onSnapshot={onSnapshot}
        onImage={onImage}
        onClear={onClear}
        onExport={onExport}
        onImport={onImport}
        onTrim={onTrim}
        parent={actionsFolderRef}
      />
      {/* debugging && (
        <Output
          shadow={shadow}
          width={width}
          height={height}
          size={size}
          translateX={translateX}
          translateY={translateY}
        />
      ) */}
    </Container>
  )
}

render(<App />, document.querySelector('#app'))
