const { Meanderer, Splitting } = window

Splitting()

const path =
  'M-44.2 285.7s322.4 166.3 398.8 55c30.1-43.8-30.5-139.8 78.4-142.9 298-8.5-202.5 280.5-5.3 371.2 320 147.2 31.6-586 328-543.5C957 54.4 571.3 503.2 766.3 491.9c195-11.3-3-207.9 154.2-217.7 338-21.1-239.6 333.4 111.2 341.7 391.9 9.3-193.4-489.2 168.5-604 283.5-90 24.8 372.8 246.5 194.2 189-152.2 228.8-127.4 305.4-8.3 76.3 118.7 59.6 160.4-60.5 188.3-84.6 19.6-559.4-165.6-415 54.4 236.7 360.7 394.6 153.4 521.6 56'
const width = 1798.5
const height = 644.8

const RESPONSIVE_PATH = new Meanderer({
  path,
  width,
  height,
})

const CONTAINER = document.querySelector('.container')

const UPDATE = () => {
  const NEW_PATH = RESPONSIVE_PATH.generatePath(
    CONTAINER.offsetWidth,
    CONTAINER.offsetHeight
  )
  CONTAINER.style.setProperty('--path', `"${NEW_PATH}"`)
}

const OBSERVER = new ResizeObserver(UPDATE)
OBSERVER.observe(CONTAINER)
