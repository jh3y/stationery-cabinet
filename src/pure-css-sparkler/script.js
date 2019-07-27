/**
 * JavaScript only used to update sparkler position 😅
 */ const root = document.documentElement
const update = e => {
  let x
  let y
  /* eslint-disable */ if (window.PointerEvent) {
    ;({ x, y } = e)
  } else {
    ;({ pageX: x, pageY: y } = e.changedTouches[0])
  }
  root.style.setProperty('--x', x)
  root.style.setProperty('--y', y)
}
update({
  x: innerWidth / 2,
  y: innerHeight / 2,
  changedTouches: [{ pageX: innerWidth / 2, pageY: innerHeight / 2 }],
})
const move = window.PointerEvent ? 'pointermove' : 'touchmove'
const down = window.PointerEvent ? 'pointerdown' : 'touchstart'
if (!window.PointerEvent) document.body.style.touchAction = 'auto'
window.addEventListener(move, update)
window.addEventListener(down, update)
