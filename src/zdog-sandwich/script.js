const {
  TweenMax,
  TimelineMax,
  Snap: {
    path: { toCubic },
  },
  Zdog: { Illustration, TAU, Shape, Group, Ellipse },
} = window
const COLORS = {
  CHEESE: '#ffa600',
  BREAD: '#c68958',
  LETTUCE: '#41eb8e',
  EYE: 'black',
  MEAT: '#a53535',
  TONGUE: 'red',
}
const PATHS = {
  LETTUCE:
    'm 101.94136,225.65244 c 0,2.08221 -0.54094,4.13503 -0.62108,6.21573 -0.11842,3.07393 1.93227,6.67841 0.2085,9.22627 -0.95916,1.41769 -4.187785,0.20683 -4.808397,1.80201 -0.741441,1.90572 3.071487,3.44512 2.779134,5.46898 -0.389247,2.69465 -3.097743,4.88668 -5.609709,5.93676 -3.266759,1.36564 -7.957931,-2.5665 -10.619599,-0.23152 -1.136942,0.99738 0.720058,3.6066 -0.492571,4.51046 -3.099164,2.31008 -7.579928,-1.54298 -11.406881,-2.08676 -2.043747,-0.2904 -4.13892,-0.21158 -6.161043,-0.62659 -1.963486,-0.40299 -3.755677,-1.50315 -5.738417,-1.79711 -1.831602,-0.27157 -3.703041,0.0602 -5.554639,0.0506 -2.53362,-0.0131 -5.222315,0.7283 -7.599516,-0.14825 -2.607644,-0.96151 -4.8585,-3.00704 -6.446312,-5.28808 -0.800357,-1.1498 -1.128222,-2.59308 -1.371461,-3.97271 -0.534051,-3.02914 0.623884,-6.25024 -0.153284,-9.22628 -0.33508,-1.28314 -1.526711,-2.22617 -1.887325,-3.50236 -0.744945,-2.63633 0.409766,-5.60915 -0.464263,-8.20553 -0.487233,-1.44737 -2.677139,-2.27686 -2.560085,-3.79955 0.283036,-3.68186 7.857002,-4.45573 7.52176,-8.13321 -0.19395,-2.12756 -4.700081,-1.74842 -5.130724,-3.84096 -0.390134,-1.8957 2.316253,-3.18587 2.896346,-5.03231 0.774958,-2.46671 -0.879674,-5.6584 0.670579,-7.72766 2.782723,-3.71437 8.334516,-4.93202 12.974064,-5.05316 3.36838,-0.088 6.243799,3.49337 9.597977,3.17211 2.892892,-0.27708 4.708632,-4.06186 7.608175,-4.25746 3.926658,-0.26488 7.060371,4.02639 10.984259,4.32959 2.816453,0.21764 5.562342,-2.67145 8.26801,-1.85957 3.914207,1.17452 6.098748,5.52719 8.503972,8.83103 1.700515,2.33586 3.85313,4.76051 4.09472,7.63968 0.16471,1.96287 -1.85888,3.63114 -1.88457,5.60072 -0.02641,2.0189 1.38207,3.81015 1.7813,5.78936 0.41171,2.04111 0.62108,4.1335 0.62108,6.21573 z',
  SLICE:
    'm 7.9453125,-12.201172 c -9.7440571,-0.234513 -17.59375,7.8468714 -17.59375,17.5937501 V 16.458984 c 0,6.88043 3.919999,12.798434 9.6484375,15.69336 0,0 -13.540413,207.572526 0,217.847656 9.8359703,7.46402 83.90087,-1.70261 125.56754,-1.70261 41.66666,0 120.00212,13.46013 124.43246,1.70261 6.3278,-16.79313 0,-217.101562 0,-217.101562 6.64216,-2.511135 11.35156,-8.896866 11.35156,-16.439454 V 5.3925781 c 0,-9.7468787 -7.84687,-17.5937501 -17.59375,-17.5937501 0,0 -78.59278,2.8376846 -117.90625,2.8376846 -39.313463,0 -117.9062475,-2.8376846 -117.9062475,-2.8376846 z',
}

/**
 * Some magic from Chris Gannon!
 * https://codepen.io/chrisgannon/pen/OYadbL
 * Thanks! 👍
 */ function makeZdogBezier(_path) {
  let arr = []
  arr[0] = { x: _path[0].x, y: _path[0].y }
  for (let i = 1; i < _path.length; i++) {
    if (i % 3 == 0) {
      var key = 'bezier'
      var obj = {}
      obj[key] = [
        { x: _path[i - 2].x, y: _path[i - 2].y },
        { x: _path[i - 1].x, y: _path[i - 1].y },
        { x: _path[i].x, y: _path[i].y },
      ]
      arr.push(obj)
    }
  }
  return arr
}
/**
 * Function to normalize the path Array
 * and reduce any offset that may be in place
 * Not perfect but does make the path text a little easier to work with
 */
const normalize = arr => {
  const { x: offsetX, y: offsetY } = arr[0]
  return arr.map(e => ({ x: e.x - offsetX, y: e.y - offsetY }))
}
/**
 * Generates the path array from a path string
 */
const getPath = pathString =>
  normalize(
    // SnapSVG toCubic
    toCubic(pathString).reduce((a, c) => {
      c.map((e, i) => {
        if (i % 2 === 1) {
          const [x, y] = c.slice(i, i + 2)
          a.push({ x, y })
        }
      })
      return a
    }, [])
  ) // EXAMPLE
const Scene = new Illustration({
  element: 'canvas',
  resize: 'fullscreen',
  dragRotate: true,
  rotate: {
    x: TAU * 0.05,
    y: TAU * 0.1,
  },
})
const Sandwich = new Group({
  addTo: Scene,
  scale: 0.75,
})
const DEPTHS = {
  SLICE_ONE: 45,
  SLICE_TWO: -45,
  CHEESE: -20,
  MEAT: 20,
}
const Slice = new Shape({
  path: makeZdogBezier(getPath(PATHS.SLICE)),
  fill: true,
  color: COLORS.BREAD,
  stroke: 20,
  addTo: Sandwich,
  translate: {
    x: -120,
    y: -130,
    z: DEPTHS.SLICE_ONE,
  },
})
new Shape({
  path: makeZdogBezier(getPath(PATHS.LETTUCE)),
  fill: true,
  stroke: 15,
  scale: 4.75,
  color: COLORS.LETTUCE,
  addTo: Sandwich,
  translate: {
    x: 160,
    y: 15,
  },
})
const Meat = new Group({
  addTo: Sandwich,
  translate: {
    z: DEPTHS.MEAT,
  },
})
const Salami = new Ellipse({
  diameter: 110,
  fill: true,
  stroke: 15,
  color: COLORS.MEAT,
  addTo: Meat,
})
Salami.copy({
  translate: {
    x: -85,
    y: -85,
  },
})
Salami.copy({
  translate: {
    x: 85,
    y: -85,
  },
})
Salami.copy({
  translate: {
    x: -85,
    y: 85,
  },
})
Salami.copy({
  translate: {
    x: 85,
    y: 85,
  },
})
const Cheese = new Shape({
  addTo: Sandwich,
  stroke: 15,
  fill: true,
  color: COLORS.CHEESE,
  translate: {
    z: DEPTHS.CHEESE,
  },
  path: [
    {
      x: -135,
      y: -135,
    },
    {
      x: 135,
      y: -135,
    },
    {
      x: 135,
      y: 135,
    },
    {
      x: -135,
      y: 135,
    },
  ],
})
const second = Slice.copy({
  translate: {
    ...Slice.translate,
    z: DEPTHS.SLICE_TWO,
  },
}) // Copy the slice before adding the face
const Eye = new Ellipse({
  addTo: second,
  fill: true,
  diameter: 30,
  stroke: 2,
  backface: COLORS.BREAD,
  color: COLORS.EYE,
  translate: {
    x: 70,
    y: 60,
    z: -5,
  },
})
const Pupil = new Ellipse({
  addTo: Eye,
  fill: true,
  stroke: 2,
  backface: COLORS.BREAD,
  color: 'white',
  diameter: 6,
  translate: {
    x: -4,
    y: -4,
  },
})
Pupil.copy({
  scale: 0.75,
  translate: {
    x: -5,
    y: 3,
    z: 1,
  },
})
Eye.copyGraph({
  translate: {
    ...Eye.translate,
    x: 170,
    y: 60,
  },
})
const mouth = new Ellipse({
  addTo: second,
  fill: true,
  color: COLORS.EYE,
  diameter: 40,
  quarters: 2,
  backface: COLORS.BREAD,
  rotate: {
    z: TAU * 0.25,
  },
  translate: {
    x: 120,
    y: 90,
    z: -5,
  },
})
new Shape({
  addTo: mouth,
  diameter: 10,
  color: COLORS.TONGUE,
  fill: true,
  stroke: 4,
  backface: COLORS.BREAD,
  path: [{ x: 15, y: 5 }, { x: 15, y: -5 }],
})
const start = () => {
  Scene.updateRenderGraph()
  requestAnimationFrame(start)
}
start()
let expanded = false
let expanding = false
const EXPANSION = 90
const DURATION = 0.15
const toggle = () => {
  if (expanding) return
  const expand = new TimelineMax({
    onStart: () => {
      expanding = true
    },
    onComplete: () => {
      expanding = false
      expanded = !expanded
    },
  })
  expand.add(
    TweenMax.to(Slice.translate, DURATION, {
      z: expanded ? DEPTHS.SLICE_ONE : DEPTHS.SLICE_ONE + EXPANSION,
    }),
    0
  )
  expand.add(
    TweenMax.to(second.translate, DURATION, {
      z: expanded ? -DEPTHS.SLICE_ONE : -(DEPTHS.SLICE_ONE + EXPANSION),
    }),
    0
  )
  expand.add(
    TweenMax.to(Meat.translate, DURATION, {
      z: expanded ? DEPTHS.MEAT : DEPTHS.MEAT + EXPANSION / 2,
    }),
    0
  )
  expand.add(
    TweenMax.to(Cheese.translate, DURATION, {
      z: expanded ? -DEPTHS.MEAT : -(DEPTHS.MEAT + EXPANSION / 2),
    }),
    0
  )
} // On double click expand sandwich
window.addEventListener('touchstart', toggle)
window.addEventListener('dblclick', toggle)
