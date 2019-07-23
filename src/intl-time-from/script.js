/**
 * A utility function for grabbing the time last visited
 * @param {Date} date - Date object that you want time since
 * @param {number} places - How many decimal places to show
 */
const lastVisited = (date, places = 3) => {
  // If it isn't supported, return the date supplied 👍
  if (!Intl.RelativeTimeFormat) return date
  const now = new Date()
  const formatter = new Intl.RelativeTimeFormat(navigator.language)
  let ms = date.getTime() - now.getTime()
  return [
    ['second', 1000],
    ['minute', 60],
    ['hour', 60],
    ['day', 24],
    ['week', 7],
  ].reduce(
    (a, c) => ({
      ...a,
      ...{
        [c[0]]: formatter.format((ms /= c[1]).toFixed(places), c[0]),
      },
    }),
    {}
  )
}
/**
 * Appy stuff
 */
let unit = 'second'
let place = 0
const text = document.querySelector('h1')
const units = document.querySelector('select:nth-child(1)')
const places = document.querySelector('select:nth-child(2)')
const unitUpdate = e =>
  e.target.value !== 'Select unit' && (unit = e.target.value)
const placeUpdate = e =>
  e.target.value !== 'Select places' && (place = e.target.value)
const start = new Date()
const report = () => {
  const last = lastVisited(start, place)
  if (last === start) {
    // Hide the select and set the innerText as the start date
    text.innerText = `Last visited\n${start}`
    units.remove()
    places.remove()
  } else {
    text.innerText = `Last visited\n${last[unit]}`
    requestAnimationFrame(report)
  }
}
if (Intl.RelativeTimeFormat) {
  units.addEventListener('input', unitUpdate)
  places.addEventListener('input', placeUpdate)
}
requestAnimationFrame(report)
