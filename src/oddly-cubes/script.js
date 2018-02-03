const CLASSES = {
  COLUMN: 'column',
  CUBE: 'cube',
  LAYER: 'layer__wrapper',
}

const cubeSize = parseFloat(getComputedStyle(document.querySelector(`.${CLASSES.CUBE}`)).height, 10)
const duration = .5
const delay = 0.15


/**
 * Handle column animations
 *
 * 1. Grab the first and last column of each layer
 * 2. Create a timeline where the columns move out
 * 3. Create a reversed version of that timeline in a tween where
 *  columns move back to original position
 */
const firstColumns = document.querySelectorAll(`.${CLASSES.COLUMN}:first-child`)
const lastColumns = document.querySelectorAll(`.${CLASSES.COLUMN}:last-child`)

const columnTl = new TimelineLite()

const moveFirstColumns = TweenLite.to(firstColumns, duration, {
  x: '-100%',
  delay,
})

const moveLastColumns = TweenLite.to(lastColumns, duration, {
  x: '100%',
  delay,
})

// Create parallel animation using position parameter
columnTl.add(moveFirstColumns)
columnTl.add(moveLastColumns, 0)

const columnTlR = TweenLite.to([firstColumns, lastColumns], duration, {
  x: '0%',
  delay,
})

/**
 * Handle cube animations
 *
 * 1. Grab the first and last cube of each column
 * 2. Create a timeline that moves those cubes out
 * 3. Create a reversed version of that timeline in a tween
 */
const firstCubes = document.querySelectorAll(`.${CLASSES.CUBE}:first-child`)
const lastCubes = document.querySelectorAll(`.${CLASSES.CUBE}:last-child`)

const cubeTl = new TimelineLite()

const moveFirstCubes = TweenLite.to(firstCubes, duration, {
  y: '-100%',
  delay,
})

const moveLastCubes = TweenLite.to(lastCubes, duration, {
  y: '100%',
  delay,
})

// Create parallel animation using position parameter
cubeTl.add(moveFirstCubes)
cubeTl.add(moveLastCubes, 0)

const cubeTlR = TweenLite.to([firstCubes, lastCubes], duration, {
  y: '0%',
  delay,
})

/**
 * Handle the layer animations
 *
 * 1. Grab the first and last layer
 * 2. Create a timeline that moves the layers up and down
 * 3. Create a timeline that reverses that initial timeline, could .reverse() be used here?
 */
const firstLayer = document.querySelectorAll(`.${CLASSES.LAYER}:first-child`)
const lastLayer = document.querySelectorAll(`.${CLASSES.LAYER}:last-child`)

const layerTl = new TimelineLite()

const moveFirstLayer = TweenLite.to(firstLayer, duration, {
  x: '-50%',
  y: `-${2 * cubeSize}px`,
  delay,
})

const moveLastLayer = TweenLite.to(lastLayer, duration, {
  x: '-50%',
  y: `${2 * cubeSize}px`,
  delay,
})

layerTl.add(moveFirstLayer)
layerTl.add(moveLastLayer, 0)

const layerTlR = new TimelineLite()

layerTlR.add(TweenLite.to(firstLayer, duration, {
  x: '-50%',
  y: `-${cubeSize}px`,
  delay,
}))

layerTlR.add(TweenLite.to(lastLayer, duration, {
  x: '-50%',
  y: `${cubeSize}px`,
  delay,
}), 0)

/**
 * Create the main repeating timeline
 */
const timeline = new TimelineMax()
timeline.add(columnTl)
  .add(cubeTl)
  .add(layerTl)
  .add(columnTlR)
  .add(cubeTlR)
  .add(layerTlR)
  .repeat(-1)